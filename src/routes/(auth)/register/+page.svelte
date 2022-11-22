<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Register</h1>

{#if form?.email}
	<p class="error">Email is taken.</p>
{/if}

<form action="?/register" method="POST" use:enhance>
	<input type="text" name="email" placeholder="Email" aria-label="email" required />
	<input type="text" name="username" placeholder="Username" aria-label="username" required />
	<input type="password" name="password" placeholder="Password" aria-label="Password" required />
	<button type="submit" class="contrast">Register</button>
</form>
