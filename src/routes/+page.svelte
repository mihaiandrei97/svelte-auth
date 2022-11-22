<script lang="ts">
import { page } from '$app/stores'
$: user = $page.data.user;
</script>

<h1>Welcome to SvelteKit</h1>
{#if user}
<pre>{JSON.stringify(user, null, 4)}</pre>
{:else}
<p>Not logged in.</p>
{/if}

