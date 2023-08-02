import { SetMetadata } from '@nestjs/common';
import { PermissionParamDecorator } from '../entities/permission-param-decorator.entity';

export const Role = (
	role: string | Array<PermissionParamDecorator | string>,
) => {
	return SetMetadata('role', role);
};
