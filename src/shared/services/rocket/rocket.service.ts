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
		console.log('Logando  no rocket');
		this.login({
			user: process.env.ROCKET_USER,
			password: process.env.ROCKET_PASSWORD,
		}).subscribe({
			next: (res) => {
				this.authToken = res.data.data.authToken;
				this.authIdUser = res.data.data.userId;
			},
			error: () =>
				console.log(
					'Erro ao logar no rocketchat, verifique as credenciais no ambiente.',
				),
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
				userId: user.usuario._id,
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
	): Promise<
		| {
				loginToken: string;
				userId: string;
		  }
		| boolean
	> {
		if (userData.username == 'admin') userData.username += 'dev';

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

		const authToken = await this.getPersonalToken({
			loginToken: credentials.data.data.authToken,
			userId: credentials.data.data.userId,
		});

		let personalTokens =
			authToken && authToken.data && authToken.data.tokens.length
				? authToken.data.tokens.filter(
						(token) => token.name == 'gestaointegrado',
				  )
				: false;

		if (!personalTokens || !personalTokens.length) {
			personalTokens = await this.generatePersonalToken({
				loginToken: credentials.data.data.authToken,
				userId: credentials.data.data.userId,
			});
		} else {
			personalTokens = await this.regeneratePersonalToken({
				loginToken: credentials.data.data.authToken,
				userId: credentials.data.data.userId,
			});
		}

		return {
			loginToken: personalTokens.data.token,
			userId: credentials.data.data.userId,
		};
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
		return new Promise((resolve) => {
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
					next: (res) => resolve(res),
					error: () => resolve(false),
				});
		});
	}

	regeneratePersonalToken({
		loginToken,
		userId,
	}: {
		loginToken: string;
		userId: string;
	}): Promise<any> {
		return new Promise((resolve) => {
			this.httpService
				.post(
					this.baseURL + '/users.regeneratePersonalAccessToken',
					{ tokenName: 'gestaointegrado' },
					{
						headers: {
							'X-Auth-Token': loginToken,
							'X-User-Id': userId,
							'Content-Type': 'application/json',
						},
					},
				)
				.subscribe({
					next: (res) => resolve(res),
					error: () => resolve(false),
				});
		});
	}

	getPersonalToken({
		loginToken,
		userId,
	}: {
		loginToken: string;
		userId: string;
	}) {
		return firstValueFrom(
			this.httpService.get(
				this.baseURL + '/users.getPersonalAccessTokens',
				{
					headers: {
						'X-Auth-Token': loginToken,
						'X-User-Id': userId,
					},
				},
			),
		);
	}

	getMe({ loginToken, userId }) {
		return new Promise((resolve) => {
			this.httpService
				.get(this.baseURL + '/me', {
					headers: {
						'X-Auth-Token': loginToken,
						'X-User-Id': userId,
					},
				})
				.subscribe({
					next: (res) => resolve(res),
					error: () => resolve(false),
				});
		});
	}
}
