import { db } from '$lib/db';
import { invalid, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import * as bcrypt from 'bcrypt';
import { fromDate } from '$lib/utils';
import { SESSION_MAX_AGE, SESSION_NAME } from '../../../contants';
// https://joyofcode.xyz/sveltekit-authentication-using-cookies#user-registration
export const load: PageServerLoad = async ({locals}) => {
	if (locals.user) {
		throw redirect(302, '/')
	}
};

const login: Action = async ({ cookies, request }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');

	if (typeof password !== 'string' || typeof email !== 'string' || !email || !password) {
		return invalid(400, { invalid: true });
	}

	const user = await db.user.findUnique({
		where: { email }
	});

	if (!user) {
		return invalid(400, { credentials: true });
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		return invalid(400, { credentials: true });
	}

	const session = await db.session.create({
		data: {
			sessionToken: crypto.randomUUID(),
			userId: user.id,
			expires: fromDate(SESSION_MAX_AGE)
		}
	});

	cookies.set(SESSION_NAME, session.sessionToken, {
		// send cookie for every page
		path: '/',
		// server side only cookie so you can't use `document.cookie`
		httpOnly: true,
		// only requests from same site can send cookies
		// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		sameSite: 'strict',
		// only sent over HTTPS in production
		secure: process.env.NODE_ENV === 'production',
		// set cookie to expire after a month
		maxAge: SESSION_MAX_AGE
	});

	// redirect the user
	throw redirect(302, '/');
};

export const actions: Actions = { login };
