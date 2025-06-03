<template>
	<div
		class="flex flex-col justify-center items-center text-[#ececf1] font-sans p-4 bg"
	>
		<div class="max-w-[960px] w-full pl-16 pr-0">
			<div
				class="text-xl font-bold text-white tracking-wide select-none mb-1 text-left"
			>
				Codecaine
			</div>
			<div class="text-[4.5rem] font-extrabold select-none text-left mb-0">
				Log In
			</div>
		</div>

		<div class="flex max-w-[960px] w-full rounded-lg overflow-hidden px-8">
			<div class="flex-1 p-8">
				<button
					class="w-full flex items-center py-3 px-4 mb-4 bg-[#b3b4ba] rounded cursor-pointer transition hover:bg-[#4b4e5a]"
				>
					<GoogleIcon class="w-5 h-5 mr-3" />
					Log In with Google
				</button>
				<button
					class="w-full flex items-center py-3 px-4 mb-4 bg-[#b3b4ba] rounded cursor-pointer transition hover:bg-[#4b4e5a]"
				>
					<GithubIcon class="w-5 h-5 mr-3" />
					Log In with GitHub
				</button>

				<div
					class="w-3/4 mt-4 rounded overflow-hidden transition"
					:class="{ 'bg-[#323444]': infoOpen }"
				>
					<div
						class="cursor-pointer font-medium text-base leading-tight px-4 py-2 select-none relative"
						@click="toggleInfo"
					>
						<span
							class="inline-block text-2xl mr-2 align-middle transition-transform"
							:class="{ 'rotate-90': infoOpen }"
							>▸</span
						>
						How social log in works
					</div>
					<div
						class="transition-all duration-500 ease-in-out overflow-hidden px-4"
						:class="
							infoOpen ? 'max-h-40 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
						"
						ref="infoContent"
					>
						<p class="pb-4 leading-tight text-sm">
							If the email address associated with your social account matches
							the email address of your CodePen account, you'll be logged in.
							You aren't locked to any particular social account. Questions?
							<a href="#" class="text-blue-300 underline hover:text-white"
								>contact support</a
							>.
						</p>
					</div>
				</div>
			</div>

			<div
				class="relative flex items-center justify-center self-stretch w-8 bg-[#1e1f26]"
			>
				<span
					class="absolute w-12 h-[18%] left-1/2 top-[41%] -translate-x-1/2 border-2 border-[#444] text-center flex items-center justify-center rounded-[10px] text-lg leading-[30px] bg-[#1e1f26] text-[#ccc]"
					>OR</span
				>
				<div
					class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#444]"
				></div>
			</div>

			<div class="flex-1 flex flex-col p-8">
				<form>
					<div class="mb-5">
						<label for="username" class="block mb-1 text-sm"
							>Username or Email</label
						>
						<input
							id="username"
							type="text"
							placeholder="Username or Email"
							class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-white text-base border-none"
						/>
					</div>
					<div class="mb-5">
						<label for="password" class="block mb-1 text-sm">Password</label>
						<input
							id="password"
							type="password"
							placeholder="Password"
							class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-white text-base border-none"
						/>
					</div>
					<button
						type="submit"
						class="w-full py-3 bg-[#38c172] rounded text-[#1e1f26] text-base font-medium cursor-pointer transition hover:bg-[#2fa055]"
					>
						Log In
					</button>
				</form>

				<div class="text-center my-3 text-sm">
					<a
						href="#"
						@click.prevent="toggleReset"
						class="text-blue-300 hover:text-white cursor-pointer"
						>Forgot Password?</a
					>
				</div>

				<div
					id="reset-box"
					:class="
						resetOpen
							? 'max-h-[300px] opacity-100 p-6 mt-6'
							: 'max-h-0 opacity-0 p-0 mt-0'
					"
					class="overflow-hidden transition-all duration-500 ease-in-out bg-[#323444] rounded"
					ref="resetBox"
				>
					<h2 class="mt-0 text-2xl font-semibold mb-4">Reset Your Password</h2>
					<form>
						<div class="mb-5">
							<label for="reset-email" class="block mb-1 text-sm"
								>Username Or Email</label
							>
							<input
								id="reset-email"
								type="text"
								placeholder="your@email.com"
								class="w-full py-3 px-4 rounded bg-[#b3b4ba] text-white text-base border-none"
							/>
						</div>
						<button
							type="button"
							class="w-full py-3 bg-[#3a3c46] text-[#ececf1] rounded text-base cursor-pointer transition hover:bg-[#4b4e5a]"
						>
							Send Password Reset Email
						</button>
					</form>
				</div>
			</div>
		</div>

		<footer
			class="max-w-[960px] w-full p-4 flex justify-center items-center mt-4"
		>
			<div class="text-sm text-[#ececf1]">
				Need an account?
				<a href="#" class="text-blue-300 font-medium underline hover:text-white"
					>Sign up now!</a
				>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { ref, nextTick } from "vue";

import GoogleIcon from "@/components/icons/GoogleIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";

const infoOpen = ref(false);
const infoContent = ref(null);

const resetOpen = ref(false);
const resetBox = ref(null);

const toggleInfo = () => {
	if (!infoOpen.value) {
		infoOpen.value = true;
		nextTick(() => {
			const el = infoContent.value;
			el.style.maxHeight = el.scrollHeight + "px";
			el.style.opacity = "1";
		});
	} else {
		const el = infoContent.value;
		el.style.maxHeight = "0";
		el.style.opacity = "0";
		setTimeout(() => {
			infoOpen.value = false;
		}, 500);
	}
};

const toggleReset = () => {
	resetOpen.value = !resetOpen.value;
	nextTick(() => {
		const el = resetBox.value;
		if (resetOpen.value) {
			el.style.maxHeight = el.scrollHeight + "px";
			el.style.opacity = "1";
		} else {
			el.style.maxHeight = "0";
			el.style.opacity = "0";
		}
	});
};
</script>

<style scoped>
.bg {
	background-image: url("https://cpwebassets.codepen.io/assets/logos/codepen-logo-pattern-b477875ac66ffc21e4485a989358c220fac283caf17e602346a50d4250970254.png");
}
</style>
