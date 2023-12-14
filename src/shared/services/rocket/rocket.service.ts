import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';
@Injectable()
export class RocketService {
	baseURL: string;
	authToken: string;
	authIdUser: string;
	constructor(private readonly httpService: HttpService) {
		this.baseURL = process.env.ROCKET_URL;
		console.log('Requisitando rocket');
		this.login({
			user: process.env.ROCKET_USER,
			password: process.env.ROCKET_PASSWORD,
		}).subscribe({
			next: (res) => {
				this.authToken = res.data.data.authToken;
				this.authIdUser = res.data.data.userId;
			},
			error: (err) => console.log(err),
		});
	}

	get(path: string) {
		return this.httpService.get(this.baseURL + path, {
			headers: {
				'X-Auth-Token': this.authToken,
				'X-User-Id': this.authIdUser,
				'Content-Type': 'application/json',
			},
		});
	}

	post(path: string, data: any): Observable<AxiosResponse<any>> {
		return this.httpService.post(this.baseURL + path, data, {
			headers: {
				'X-Auth-Token': this.authToken,
				'X-User-Id': this.authIdUser,
				'Content-Type': 'application/json',
			},
		});
	}

	getUser(username: string): Promise<any> {
		return new Promise((resolve) => {
			this.get('/users.info?username=' + username).subscribe({
				next: (res) => resolve(res.data.user),
				error: () => {
					resolve(false);
				},
			});
		});
	}

	createUser(
		user: {
			username: string;
			name: string;
			email: string;
		},
		password: string,
	) {
		return new Promise((resolve, reject) => {
			this.post('/users.create', {
				...user,
				roles: ['user'],
				requirePasswordChange: false,
				password,
			}).subscribe({
				next: (res) => resolve(res.data),
				error: () => reject(false),
			});
		});
	}

	async upadateUser(username: string, password: string) {
		const user = await this.getUser(username);
		return new Promise((resolve, reject) => {
			this.post('/users.update', {
				userId: user.user._id,
				data: { password },
			}).subscribe({
				next: (res) => resolve(res.data),
				error: () => reject(false),
			});
		});
	}

	async generateToken(
		userData: {
			username: string;
			email: string;
			name: string;
		},
		password: string,
	) {
		if (userData.username !== 'admin') {
			let user = await this.getUser(userData.username);
			if (!user) {
				user = await this.createUser(
					{
						username: userData.username,
						name: userData.name,
						email: userData.email,
					},
					password,
				);
			}

			const credentials = await firstValueFrom(
				this.login({ user: userData.username, password }),
			);

			const authToken = await this.generatePersonalToken({
				loginToken: credentials.data.data.authToken,
				userId: credentials.data.data.userId,
			});

			if (authToken) {
				return {
					loginToken: authToken.data.data.authToken,
				};
			}

			return {
				loginToken: credentials.data.data.authToken,
			};
		} else {
			return false;
		}
	}

	login(data: {
		user: string;
		password: string;
	}): Observable<AxiosResponse<any>> {
		return this.httpService.post(this.baseURL + '/login', data, {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	generatePersonalToken({
		loginToken,
		userId,
	}: {
		loginToken: string;
		userId: string;
	}): Promise<any> {
		return new Promise((resolve, _) => {
			this.httpService
				.post(
					this.baseURL + '/users.generatePersonalAccessToken',
					{ tokenName: 'gestaointegrado', bypassTwoFactor: false },
					{
						headers: {
							'X-Auth-Token': loginToken,
							'X-User-Id': userId,
							'Content-Type': 'application/json',
						},
					},
				)
				.subscribe({
					next: (res) => resolve(res.data),
					error: () => resolve(false),
				});
		});
	}
}
