import { db } from '$lib/db';
import { invalid, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import * as bcrypt from 'bcrypt';

enum Roles {
	ADMIN = 'ADMIN',
	USER = 'USER'
}

export const load: PageServerLoad = async ({locals}) => {
	if (locals.user) {
		throw redirect(302, '/')
	}
};

const register: Action = async ({ request }) => {
	const data = await request.formData();
	const email = data.get('email');
	const username = data.get('username');
	const password = data.get('password');

	if (
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		typeof email !== 'string' ||
		!email ||
		!username ||
		!password
	) {
		return invalid(400, { invalid: true });
	}

	const user = await db.user.findUnique({
		where: { email }
	});

	if (user) {
		return invalid(400, { email: true });
	}

	await db.user.create({
		data: {
			email,
			password: await bcrypt.hash(password, 12),
			username,
			role: {
				connectOrCreate: {
					where: {
						name: Roles.USER
					},
					create: {
						name: Roles.USER
					}
				}
			}
		}
	});

	throw redirect(303, '/login')

};

export const actions: Actions = { register };
