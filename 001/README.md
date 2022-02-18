## Authors
* [Glevinzon Dapal](https://app.identifi.com/profile/00a0128bdc38887a855480f7c38ffe84)

## Goal Statements

At the end of this experiment, we should be able to;

- Know the basics of Svelte, e.g. basic code structure, styling, passing of props, stores, bindings etc.
- Know how reactivity works with Svelte and how would it behave on certain use-cases.
- Explore SvelteKit and try out the cool stuffs bundled with it, e.g. SSR, prerendering, routing etc.
- Demonstrate server-side rendering and examine how fast would it fetch and display data on Client's browser
- Know when to use SvelteKit over Sapper
- Create custom component using Svelte and styled it using Tailwindcss
- Research on articles online that talked about reasons why would they use Svelte on their projects.

## Abstract

By using Svelte and SvelteKit, this experiment has been able to convert the [Jamclout](https://beta-app.jamclout.com/u/Arriele)'s creator profile page that was developed using ReactJS into a Svelte equivalent codes. Side-tasks such as fetching of creator profile data from its backend API was achieved through the use of a library called `apollo-client`, and, the layout creation & custom styling of components were made swiftly by integrating `TailwindCSS`. SvelteKit's framework made it extra fast to develop in Svelte, it's models and concepts are almost the same with React's `NextJS` which we are already been using here in the company and so, it did not take too much time adapting and using Svelte. This experiment was abled to demonstrate or at least tackled the common topics of using a SvelteKit framework, such as but not limited to, the use of Props, Routing, Nesting & Resetting of common layout, event handling, animation, stores, SSR, prerendering among many other.

One of the few challenges that was encountered was installing of packages and make it work with Svelte, many times, it took lots of readings and time scouring the internet for answers. This was expected since Svelte is still in its early development and still gaining traction, support for compatibility might occur. The community is not that big yet compared to other popular frameworks, but it is getting there.

In the last days of this experiment, Roger was able to raised the issue about SSR not working as expected, and so the last stretch was to examine it and check the behavior of the code behind it. Verily, there was an issue on how was the SSR code were implemented, this was fixed by following the right syntax of using the `fetch` API inside of `load` function. This way, the SSR's behavior worked as expected.

## Conclusion

As a ReactJS developer who already has the experience working with NextJS, development using Svelte and SvelteKit did not require so much effort on adjusting on the syntaxes, nor of the concepts like Reactiveness, stores, SSR and so on. Although I must say, that the most painful experience was the readings I had. There were so much of it that it actually put a toll on my body. I was sick for 1 week because of it. Well, this maybe because of the information I've consumed in a short period of time.

The Svelte and SvelteKit tandem is most certainly matured enough to be used in projects that can be served in Production. I say this, because of the comprehensive documentation that they have from the basics of creating file and its code structure, up until putting the site/app to live servers.

Svelte may not yet in the level of ReactJS nor of VueJS, but soon enough, as communities and organizations starts adapting this, we will see a new rising star in town.

In our company, I would be recommend that we adapt Svelte gradually, for instance, we can develop landing pages and blog sites using Svelte, and as soon as our developers be adept enough to Svelte then we can consider it for much bigger projects.

## Resources

- [](https://news.ycombinator.com/item?id=26558672#:~:text=Basically%2C%20SvelteKit%20is%20serverless%2Dfirst,a%20much%20nicer%20developer%20experience.&text=The%20way%20I%20understand%20it,with%20respect%20to%20the%20backend)[https://news.ycombinator.com/item?id=26558672#:~:text=Basically%2C](https://news.ycombinator.com/item?id=26558672#:~:text=Basically%2C) SvelteKit is serverless-first,a much nicer developer experience.&text=The way I understand it,with respect to the backend.
- [](https://sapper.svelte.dev/docs#Introduction)[https://sapper.svelte.dev/docs#Introduction](https://sapper.svelte.dev/docs#Introduction)
- [](https://kit.svelte.dev/docs)[https://kit.svelte.dev/docs](https://kit.svelte.dev/docs)
- [](https://dev.to/danawoodman/when-to-use-svelte-vs-sveltetkit-vs-sapper-4o6a)[https://dev.to/danawoodman/when-to-use-svelte-vs-sveltetkit-vs-sapper-4o6a](https://dev.to/danawoodman/when-to-use-svelte-vs-sveltetkit-vs-sapper-4o6a)
- [](https://github.com/svelte-add/svelte-add)[https://github.com/svelte-add/svelte-add](https://github.com/svelte-add/svelte-add)
- [](https://dev.to/alecaivazis/building-an-application-with-graphql-and-sveltekit-3heb)[https://dev.to/alecaivazis/building-an-application-with-graphql-and-sveltekit-3heb](https://dev.to/alecaivazis/building-an-application-with-graphql-and-sveltekit-3heb)
- [](https://github.com/AlecAivazis/houdini)[https://github.com/AlecAivazis/houdini](https://github.com/AlecAivazis/houdini)
- [](https://www.npmjs.com/package/svelte-apollo-client)[https://www.npmjs.com/package/svelte-apollo-client](https://www.npmjs.com/package/svelte-apollo-client)
- [](https://www.npmjs.com/package/graphql-codegen-svelte-apollo)[https://www.npmjs.com/package/graphql-codegen-svelte-apollo](https://www.npmjs.com/package/graphql-codegen-svelte-apollo)
- [](https://tailwindcss.com/docs/guides/sveltekit)[https://tailwindcss.com/docs/guides/sveltekit](https://tailwindcss.com/docs/guides/sveltekit)
- [](https://youtu.be/UU7MgYIbtAk)[https://youtu.be/UU7MgYIbtAk](https://youtu.be/UU7MgYIbtAk)
- [](https://kit.svelte.dev/docs#appendix-ssr)[https://kit.svelte.dev/docs#appendix-ssr](https://kit.svelte.dev/docs#appendix-ssr)
- [](https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus)[https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus](https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus)
- [](https://rodneylab.com/sveltekit-graphql-type-generation/)[https://rodneylab.com/sveltekit-graphql-type-generation/](https://rodneylab.com/sveltekit-graphql-type-generation/)
- [](https://kit.svelte.dev/docs#layouts-nested-layouts)[https://kit.svelte.dev/docs#layouts-nested-layouts](https://kit.svelte.dev/docs#layouts-nested-layouts)
- [](https://www.reddit.com/r/sveltejs/comments/p28oht/how_to_redirect_to_a_url_in_svelte_kit/)[https://www.reddit.com/r/sveltejs/comments/p28oht/how_to_redirect_to_a_url_in_svelte_kit/](https://www.reddit.com/r/sveltejs/comments/p28oht/how_to_redirect_to_a_url_in_svelte_kit/)
- [](https://www.npmjs.com/package/svelte-icon)[https://www.npmjs.com/package/svelte-icon](https://www.npmjs.com/package/svelte-icon)
- [](https://www.reddit.com/r/sveltejs/comments/nzi934/how_to_add_plugins_to_svelteconfigjs/)[https://www.reddit.com/r/sveltejs/comments/nzi934/how_to_add_plugins_to_svelteconfigjs/](https://www.reddit.com/r/sveltejs/comments/nzi934/how_to_add_plugins_to_svelteconfigjs/)
- [](https://dev.to/codesphere/svelte-jss-smallest-next-big-thing-3mck)[https://dev.to/codesphere/svelte-jss-smallest-next-big-thing-3mck](https://dev.to/codesphere/svelte-jss-smallest-next-big-thing-3mck)
- [](https://dev.to/isaachagoel/svelte-reactivity-gotchas-solutions-if-you-re-using-svelte-in-production-you-should-read-this-3oj3)[https://dev.to/isaachagoel/svelte-reactivity-gotchas-solutions-if-you-re-using-svelte-in-production-you-should-read-this-3oj3](https://dev.to/isaachagoel/svelte-reactivity-gotchas-solutions-if-you-re-using-svelte-in-production-you-should-read-this-3oj3)
- [](https://dev.to/sm0ke/svelte-js-open-source-starters-e1m)[https://dev.to/sm0ke/svelte-js-open-source-starters-e1m](https://dev.to/sm0ke/svelte-js-open-source-starters-e1m)
- [](https://kit.svelte.dev/docs#adapters)[https://kit.svelte.dev/docs#adapters](https://kit.svelte.dev/docs#adapters)
- [](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)[https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)
- [](https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3)[https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3](https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3)
- [](https://dev.to/mikenikles/why-i-moved-from-react-to-svelte-and-others-will-follow-210l)[https://dev.to/mikenikles/why-i-moved-from-react-to-svelte-and-others-will-follow-210l](https://dev.to/mikenikles/why-i-moved-from-react-to-svelte-and-others-will-follow-210l)
- [](https://www.npmjs.com/package/svelte-blurhash)[https://www.npmjs.com/package/svelte-blurhash](https://www.npmjs.com/package/svelte-blurhash)
- [](https://github.com/woltapp/blurhash/tree/master/TypeScript)[https://github.com/woltapp/blurhash/tree/master/TypeScript](https://github.com/woltapp/blurhash/tree/master/TypeScript)
- [](https://overreacted.io/react-as-a-ui-runtime/)[https://overreacted.io/react-as-a-ui-runtime/](https://overreacted.io/react-as-a-ui-runtime/)
- [](https://svelte.dev/blog/virtual-dom-is-pure-overhead)[https://svelte.dev/blog/virtual-dom-is-pure-overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead)

## Documentation

**Topics learned**

- File structure
- Routing(file-based routing)
- Props
- Nesting layout and resetting prior layouts
- Apollo client integration
- Graphql codegen type defs
- Basic SSR(server-side rendering) and passing props
- When to use SvelteKit vs Sapper
- Adding plugin to svelte config in respect to rollout config of Sapper
- Svelte animation - transition
- IF condition {#if}
- Iteration {#each}
- Tab component making using Svelte and Tailwindcss
- Prerendering
- Asset handling
- Why I have decided to use SvelteKit over Sapper
- On click event handling
- Icon handling, and why packages on npmjs was a headache
- virtual DOM diffing
- env variables - [](https://dev.to/this-is-learning/environment-variables-with-sveltekit-508)[https://dev.to/this-is-learning/environment-variables-with-sveltekit-508](https://dev.to/this-is-learning/environment-variables-with-sveltekit-508)

**Topics to learn on Week 1**

- how store works
- hardcore typedefs
- how hydration works
- deploying sveltekit
- how hooks work
- lifecycle in-depth look
- forms

**Challenges**

- making UI components take a while to create
- svelte-icon package didn’t do well with the project
- lots of research and readings
- slow workstation
- svelvekit’s docs is a bit overwhelming

**Terminologies**

- bloated in-memory run-time framework
- virtual DOM - [](https://svelte.dev/blog/virtual-dom-is-pure-overhead)[https://svelte.dev/blog/virtual-dom-is-pure-overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead)
- virtual DOM diffing **-** a technique that abstracts away all the fussy implementation
- framework-less vanilla JavaScript

**Issues Encountered**

- [](https://github.com/apollographql/apollo-client/issues/8218)[https://github.com/apollographql/apollo-client/issues/8218](https://github.com/apollographql/apollo-client/issues/8218)

**Whats under the hood**
[](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)[https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)

**Reasons to use svelte**
[](https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3)[https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3](https://dev.to/mhatvan/10-reasons-why-i-recommend-svelte-to-every-new-web-developer-nh3)

**About the compiler**
[](https://svelte.dev/blog/frameworks-without-the-framework)[https://svelte.dev/blog/frameworks-without-the-framework](https://svelte.dev/blog/frameworks-without-the-framework)

**Svelte with no runtime system with a bit of stats**
[](https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381)[https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381](https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381)

**In-depth reactivity**
[](https://dev.to/kevinast/responsive-svelte-exploring-svelte-s-reactivity-5cen)[https://dev.to/kevinast/responsive-svelte-exploring-svelte-s-reactivity-5cen](https://dev.to/kevinast/responsive-svelte-exploring-svelte-s-reactivity-5cen)

**How does Svelte determine when to trigger the re-execution our snippets?**
The short answer is that Svelte monitors the dependent state referenced in each snippet, and triggers a re-execution whenever that state changes.

**UI component frameworks/libraries**

- [](https://sveltematerialui.com/)[https://sveltematerialui.com/](https://sveltematerialui.com/)
- [](https://smeltejs.com/)[https://smeltejs.com/](https://smeltejs.com/)
- [](https://svelte-materialify.vercel.app/)[https://svelte-materialify.vercel.app/](https://svelte-materialify.vercel.app/)
- [](https://sveltestrap.js.org/?path=/story/components--get-started)[https://sveltestrap.js.org/?path=/story/components--get-started](https://sveltestrap.js.org/?path=/story/components--get-started)

**Creating own UI components**

- [](https://dev.to/logrocket/build-your-own-component-library-with-svelte-510l)[https://dev.to/logrocket/build-your-own-component-library-with-svelte-510l](https://dev.to/logrocket/build-your-own-component-library-with-svelte-510l)

**Lifecycle methods**

- [](https://dev.to/geoffrich/sveltes-lifecycle-methods-can-be-used-anywhere-4e77)[https://dev.to/geoffrich/sveltes-lifecycle-methods-can-be-used-anywhere-4e77](https://dev.to/geoffrich/sveltes-lifecycle-methods-can-be-used-anywhere-4e77)

**Basic SSR implementation (sample only)**

```tsx
<script lang="ts" context="module">
   export async function load({page}) {
		 const id = page.params.id;
     const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
     const res = await fetch(url);
     const pokeman = await res.json();

return {props: {pokeman}};
	}
</script>

<script lang="ts">
    export let pokeman;
</script>

```

**_Sample listener for Reactiveness_**

```tsx
$: {
  if (showModal) {
    getCreatorPost();
  }
}
```

**Store**

```tsx
<script>
	import {writable} from "svelte/store";
	let name = writable("Sarah");
	let countChanges = -1;
	name.subscribe(newName => {
		console.log("I run whenever the name changes!", newName);
		countChanges++;
	});
	$name = "John";
	$name = "Another name that will be ignored?";
	console.log("the name was indeed", $name)
	$name = "Rose";

</script>

<h1>Hello {$name}!</h1>
<p>
	I think that name has changed {countChanges} times
</p>

```

**Topics learned on Week 2**

- Svelte as one of the best ranking frameworks when it comes to **bundle size**, **performance**, **lines of code** and most importantly **developer satisfaction** [](https://2019.stateofjs.com/front-end-frameworks/)[https://2019.stateofjs.com/front-end-frameworks/](https://2019.stateofjs.com/front-end-frameworks/)
  - Much recent (most popular on github)
  ![github ranking](https://raw.githubusercontent.com/HighOutputVentures/experiments/main/001/static/misc/github-rank.png)
  - An excerpt from JS framework benchmark on Github [](https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381)[https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381](https://dev.to/jannikwempe/why-svelte-is-different-and-awesome-4381)
    - It's based on a large table with randomized entries and measures the time for various operations including rendering duration.
    - **_Performance_**

![https://res.cloudinary.com/practicaldev/image/fetch/s--zUeXmMxN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://cdn.hashnode.com/res/hashnode/image/upload/v1619355158508/Olvdi5zOk.png](https://res.cloudinary.com/practicaldev/image/fetch/s--zUeXmMxN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://cdn.hashnode.com/res/hashnode/image/upload/v1619355158508/Olvdi5zOk.png)
![https://res.cloudinary.com/practicaldev/image/fetch/s--I3wT_8Vc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://cdn.hashnode.com/res/hashnode/image/upload/v1619355565050/accrTZHyr.png](https://res.cloudinary.com/practicaldev/image/fetch/s--I3wT_8Vc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://cdn.hashnode.com/res/hashnode/image/upload/v1619355565050/accrTZHyr.png)
- What does "Svelte is a compiler" mean?
  - It essentially means that **Svelte-specific code** gets compiled (think about transformed) to JavaScript, which is executable by the browser.
  - Svelte is a compiler and therefore does not require a **runtime system** to be loaded into the client
- Easy global state management out of the box (store)
  - subscribe
  - [](https://www.notion.so/Svelte-59a4ec147b264403bfeedafef697dcbd)[https://www.notion.so/highoutput/Svelte-59a4ec147b264403bfeedafef697dcbd#d13a1f90f5984983922514493e23b798](https://www.notion.so/highoutput/Svelte-59a4ec147b264403bfeedafef697dcbd#d13a1f90f5984983922514493e23b798)
- Built-in accessibility and unused CSS checks
- Components are exported automatically
  - cons - **`.svelte` files cannot export multiple components**
- **#await blocks**

  ```tsx
  {#await promise}
    <p>...waiting</p>
  {:then number}
    <p>The number is {number}</p>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

  ```

- **Built-in effects and animations**

  - `svelte/motion` effects like tweened and spring
  - `svelte/transition` effects like fade, blur, fly, slide, scale, draw
  - `svelte/animate` effects like flip
  - `svelte/easing` effects like bounce, cubic, elastic, and many more

- **UI component frameworks/libraries**
  - [](https://sveltematerialui.com/)[https://sveltematerialui.com/](https://sveltematerialui.com/)
  - [](https://smeltejs.com/)[https://smeltejs.com/](https://smeltejs.com/)
  - [](https://svelte-materialify.vercel.app/)[https://svelte-materialify.vercel.app/](https://svelte-materialify.vercel.app/)
  - [](https://sveltestrap.js.org/?path=/story/components--get-started)[https://sveltestrap.js.org/?path=/story/components--get-started](https://sveltestrap.js.org/?path=/story/components--get-started)
- Writing web app without any framework
  **_Creating an element_**

  ```jsx
  // create a h1 element
  const h1 = document.createElement("h1");
  h1.textContent = "Hello World";
  // ...and add it to the body
  document.body.appendChild(h1);
  ```

  **_Updating an element_**

  ```jsx
  // update the text of the h1 element
  h1.textContent = "Bye World";
  ```

  **_Removing an element_**

  ```jsx
  // finally, we remove the h1 element
  document.body.removeChild(h1);
  ```

  **_Adding style to an element_**

  ```jsx
  const h1 = document.createElement("h1");
  h1.textContent = "Hello World";
  // highlight-start
  // add class name to the h1 element
  h1.setAttribute("class", "abc");
  // ...and add a <style> tag to the head
  const style = document.createElement("style");
  style.textContent = ".abc { color: blue; }";
  document.head.appendChild(style);
  // highlight-end
  document.body.appendChild(h1);
  ```

  **_Listen for click events on an element_**

  ```jsx
  const button = document.createElement("button");
  button.textContent = "Click Me!";
  // highlight-start
  // listen to "click" events
  button.addEventListener("click", () => {
    console.log("Hi!");
  });
  // highlight-end
  document.body.appendChild(button);
  ```

- How compiler works in Svelte - [](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)[https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am](https://dev.to/tanhauhau/compile-svelte-in-your-head-part-1-7am)
- **SSR done right**
  [](https://stackoverflow.com/questions/67135169/how-to-initialize-apolloclient-in-sveltekit-to-work-on-both-ssr-and-client-side)[https://stackoverflow.com/questions/67135169/how-to-initialize-apolloclient-in-sveltekit-to-work-on-both-ssr-and-client-side](https://stackoverflow.com/questions/67135169/how-to-initialize-apolloclient-in-sveltekit-to-work-on-both-ssr-and-client-side)
  [](https://hasura.io/blog/how-to-request-a-graphql-api-with-fetch-or-axios/)[https://hasura.io/blog/how-to-request-a-graphql-api-with-fetch-or-axios/](https://hasura.io/blog/how-to-request-a-graphql-api-with-fetch-or-axios/)

```tsx
export const load: Load = async ({ params }) => {
  const creatorUsername = params.username;
  const endpoint = "<https://beta-api.jamclout.com/graphql>";
  const headers = {
    "content-type": "application/json",
    // "Authorization": "<token>"
  };
  const graphqlQuery = {
    operationName: "GetProfile",
    query: `query GetProfile($username: String!) {
								creatorAccount(username: $username) {
									... on CreatorAccount {
										id
										role
										username
										description
										following
										followersCount
										followingCount
										image_next {
											id
											url
											blurhash
										}
										coverImage {
											id
											url
										}
										integrations {
											id
											type
											followersCount
											followingCount
											url
											createdAt
											externalAccount {
												username
												image
												description
												createdAt
												updatedAt
												account {
													emailAddress
													role
													createdAt
													updatedAt
												}
												... on BitcloutExternalAccount {
													id
													publicKey
													coinPrice
												}
											}
										}
										links {
											id
											link
										}
										topTippers {
											id
											externalAccount {
												... on Node {
													id
												}
												image
												username
											}
											tipsSent
										}
										topInvestors {
											id
											externalAccount {
												... on Node {
													id
												}
												image
												username
											}
											holdings
										}
									}
								}
							}`,
    variables: {
      username: creatorUsername,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };

  const response = await fetch(endpoint, options);
  creatorProfile = await response.json();

  if (response.ok) {
    return {
      props: { getProfileRes: creatorProfile },
    };
  }

  return {
    status: response.status,
    error: new Error("Could not fetch the profile"),
  };
};
```

**Topics to learn week 2**

- Lifecycle methods
- Events ( DOM, Inline handlers, Event modifiers, Component, Event forwarding, DOM event forwarding)
- Bindings (TextInput, NumericInput, Checkbox, Group, Textarea, File, Select, Media elements)
- Store (Custom, Derived, Readable, Auto-subscriptions, Writable)
- Motion, Transitions, Animations, Easing
- Hooks
- Modules

And, Many other advanced stuffs provided by the Framework



## Developing

Once cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
