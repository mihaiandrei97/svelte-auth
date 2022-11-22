<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	export let form:ActionData;


</script>

<h1>Login</h1>

{#if form?.invalid}
	<p class="error">Username and password is required.</p>
{/if}

{#if form?.credentials}
<p class="error">You have entered the wrong credentials.</p>
{/if}

<form action="?/login" method="POST" use:enhance={() => {
	return async ({ result, update }) => {
		invalidateAll();
		update();
	}
}}>
	<input type="text" name="email" placeholder="Email" aria-label="email" required />
	<input type="password" name="password" placeholder="Password" aria-label="Password" required />
	<fieldset>
		<label for="remember">
			<input type="checkbox" role="switch" id="remember" name="remember" />
			Remember me
		</label>
	</fieldset>
	<button type="submit" class="contrast">Login</button>
</form>
