<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores'
$: user = $page.data.user;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css" />
</svelte:head>

<header>
	<nav class="container">
		<a href="/">Home</a>
		<div class="login-links">
		{#if !user}
			<a href="/login">Login</a>
			<a href="/register">Register</a>
		{:else}
			<form action="/logout" method="POST" use:enhance={() => {
				return async ({ result }) => {
				invalidateAll();

				await applyAction(result);
	}
			}}>
				<button type="submit">Logout</button>
			</form>
		{/if}
		</div>
	</nav>
</header>

<body>
	<main class="container">
		<slot />
	</main>
</body>


<style>
.login-links {
    display: flex;
    gap: 20px;
}
header {
    padding: 1.75rem 0;
}
</style>