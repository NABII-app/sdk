![assets/logo.svg](assets/logo.svg)

# Nabii SDK

## _SDK of API Nabii_

---

## Summary 🧭

Welcome to the **Nabii SDK** documentation! This SDK is designed for seamless integration with the API Nabii platform. Below is a guide on how to utilize the SDK effectively.

1. [Installation](#installation)
2. [How to Use?](#how-to-use--)
   - [With EcmaScript](#-with-ecmascript-)
   - [With CommonJS](#-with-commonjs-)
3. [SDK version 1](#sdk-version-1-)

   - [Modules](#modules-)
   - [Documentation](#documentation-)
     - [Create a React Hook](#-create-a-react-hooks-)
     - [Global Methods](#-global-methods-)
     - [Authentication](#authentification-)
     - [Socket](#socket-)
     - [Versioning](#versioning)

4. [How to Develop?](#how-to-dev--)
   - [Pre-requirement](#pre-requirement-)
   - [Commands](#commands-)
   - [Architecture](#architecture-)
   - [How to Create a New Brick?](#how-to-create-a-new-brick--)
5. [Contact](#contact-)

---

## Installation

1. **Install Dependencies and Build:**

   Run the following commands:

   ```shell
   pnpm i
   pnpm build
   ```

2. **Copy Build Files:**

   - Navigate to the `dist` directory.
   - If you are using an **ESM** project, copy `index.d.ts` and `index.js`.

3. **Integrate with Your Project:**

   - Paste the copied files into your project's service folder as the `nabii-sdk` service:

     ```
     <project>/services/nabii-sdk/
     ```

4. **Install Required Packages:**

   Depending on your package manager, run one of the following commands in your project:

   ```shell
   npm i @capacitor-firebase/messaging @capacitor/core @capacitor/push-notifications @dulysse1/ts-branding @dulysse1/ts-helper axios firebase form-data socket.io-client stacktrace-parser zod
   ```

   ```shell
   yarn add @capacitor-firebase/messaging @capacitor/core @capacitor/push-notifications @dulysse1/ts-branding @dulysse1/ts-helper axios firebase form-data socket.io-client stacktrace-parser zod
   ```

   ```shell
   pnpm i @capacitor-firebase/messaging @capacitor/core @capacitor/push-notifications @dulysse1/ts-branding @dulysse1/ts-helper axios firebase form-data socket.io-client stacktrace-parser zod
   ```

5. **Update TypeScript Configuration:**

   Add the `nabii-sdk` path to your project's `tsconfig.json`:

   ```json
   // tsconfig.json
   {
     ...
     "paths": {
       ...
       "nabii-sdk": ["./<path-to>/services/nabii-sdk"] // Add this line
     },
     ...
   }
   ```

6. **Ready to Use:**

   Now you're all set! [Learn how to use it](#how-to-use--).

---

## How to use ? 🤔

### ✅ With EcmaScript ✅

```tsx
import nabii from "nabii-sdk"; // import default
// OR
import type { INabiiV1 } from "nabii-sdk"; // import nabii interface
// OR
import { NabiiError } from "nabii-sdk"; // import nabii error instance
```

### ✅ With CommonJS ✅

```js
const nabii = require("nabii-sdk"); // import default
// OR
const { NabiiError } = require("nabii-sdk"); // import nabii error instance
```

## SDK version 1 ✅

### Modules 📦

- Auth ✅
- User ✅
- Socket ✅
- Notification ✅
- Version ✅

---

### Documentation 🧗

![https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F58l5sc5jzfncrlohzinh.jpg](https://blogimages.softwaresuggest.com/blog/wp-content/uploads/2023/08/17122335/Top-14-Free-and-Open-Source-Document-Management-System.jpg)

#### 🔱 Create a react hooks 🔱

```tsx
// src/hooks/useUser.ts
import nabii, { type INabiiV1 } from "nabii-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useUser(
	params?: INabiiV1.IUserTypes.IUserParams<INabiiV1.Platform.APPLICATION>,
) {
	return useInfiniteQuery({
		queryKey: ["user", params],
		initialPageParam: params?.page ?? 1,
		queryFn: ({ pageParam }) => {
			return nabii.v1.User.Admin.getAll({
				page: pageParam,
				...params,
			});
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : undefined;
		},
	});
}
```

- Then, use your react hook into your component:

```tsx
// src/pages/home.tsx
import styles from "@/styles/Home.module.css";
import useUser from "./hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import nabii, { type INabiiV1 } from "./services/nabii/index.mjs";
import { debounce } from "./services/functions/debounce";

export default function Home() {
	const [initialized, setInitialized] = useState(false);
	const [me, setMe] =
		useState<INabiiV1.IUserTypes.IUser<INabiiV1.Platform.APPLICATION>>();
	const [search, setSearch] = useState("");

	const onEnter = async () => {
		try {
			const { user } = await nabii.v1.Auth.login(
				"email@nabii.com",
				"my_password",
			);
			setInitialized(true);
			setMe(user);
		} catch (error) {}
	};

	useEffect(() => {
		onEnter();
	}, []);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		error,
	} = useUser({ limit: 2, search });

	const debouncedSetSearch = useCallback(
		debounce((value: string) => {
			setSearch(value);
		}, 300),
		[],
	);

	if (!initialized) {
		return <div>Loading setup...</div>;
	}

	if (status === "error") {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<div>
				Hello {me?.firstName} {me?.lastName} !
			</div>
			<div>
				<input
					type="text"
					key="search"
					onChange={({ target }) => {
						debouncedSetSearch(target.value);
					}}
					placeholder="search..."
				/>
			</div>
			<div className={styles.main}>
				<ul>
					{data
						? data.pages.map(page => (
								<>
									{page.data.map(user => (
										<li key={user.id}>
											{user.name} - {user.city}
										</li>
									))}
								</>
							))
						: "loading..."}
				</ul>
				<button
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
				>
					{isFetchingNextPage
						? "Loading more..."
						: hasNextPage
							? "Load More"
							: "No more results"}
				</button>
			</div>
		</>
	);
}
```

- You can also create a rect login provider:

```tsx
// contexts/authContext.tsx
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import nabii, { type INabiiV1 } from "nabii-sdk";
import { useRouter } from "next/router";
import { storage } from "@/services/functions/storage";

export declare interface AuthContextType {
	/**
	 * the user logged {@link NabiiV1} model type set as `null` if you are not logged.
	 * @default null
	 */
	loggedUser: INabiiV1.IUserTypes.IUser<INabiiV1.Platform.APPLICATION> | null;
	/**
	 * A boolean at `true` if you can reach the server `url`
	 * @default false
	 */
	isReachable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [loggedUser, setLoggedUser] =
		useState<INabiiV1.IUserTypes.IUser<INabiiV1.Platform.APPLICATION> | null>(
			null,
		);
	const [isReachable, setIsReachable] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const onInit = async () => {
		const user = storage.get("user");
		const accessToken = storage.get("accessToken");
		const refreshToken = storage.get("refreshToken");
		if (user && accessToken && refreshToken) {
			try {
				await nabii.v1.Auth.setCredentials({
					user,
					accessToken,
					refreshToken,
				});
				if (nabii.v1.Auth.isLogged()) {
					await onLogin(nabii.v1.Auth.getCredentials());
				}
			} catch (error) {
				await onLogout();
			}
		} else {
			await onLogout();
		}
	};

	const onLogin = (credentials: INabiiV1.IGlobalTypes.ICredentials) => {
		const { user, accessToken, refreshToken } = credentials;
		storage.set("user", user);
		storage.set("accessToken", accessToken);
		storage.set("refreshToken", refreshToken);
		setLoggedUser(user);
	};

	const onLogout = () => {
		storage.remove("user");
		storage.remove("accessToken");
		storage.remove("refreshToken");
		setLoggedUser(null);
		router.push("/login");
	};

	useEffect(() => {
		nabii.v1.addEventListener("login", onLogin);
		nabii.v1.addEventListener("refresh", onLogin);
		nabii.v1.addEventListener("logout", onLogout);
		onInit().then(() => setLoading(false));
		nabii.v1.resolve().then(res => setIsReachable(res));
	}, []);

	return (
		<AuthContext.Provider
			value={{
				loggedUser,
				isReachable,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};
```

- Dont forget to include it!

```tsx
// pages/index.tsx
import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";
import type { AppProps } from "next/app";
import nabii from "nabii-sdk";
import { AuthProvider } from "@/contexts/authContext";

nabii.v1.onError(err => {
	if (err.response) {
		alert(err.response.data);
	} else {
		alert("No internet connection!");
	}
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
			</QueryClientProvider>
		</AuthProvider>
	);
}
```

### 🌐 Global methods 🌐

#### Get nabii response current language 🔠

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.getLang());
```

```shell
> "fr"
```

#### Set nabii response language 🔠

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.setLang("fr").getLang());
```

```shell
> "fr"
```

#### Get nabii current API mode 🧪

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.getMode());
```

```shell
> "production"
```

#### Set nabii current API mode 🧪

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.setMode("test").getMode());
```

```shell
> "test"
```

#### Get Nabii server URL 🖥

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.getUrl());
```

```shell
> "http://localhost:1338"
```

#### Set Nabii server URL 🖥

```tsx
import nabii from "nabii-sdk";

console.log(nabii.v1.setUrl("https://domain.com").getUrl());
```

```shell
> "https://domain.com"
```

#### Set Nabii SDK error handler ❌

```tsx
import nabii from "nabii-sdk";

nabii.v1.onError(async err => {
	console.log("wait...");
	await new Promise(res => setTimeout(res, 3000));
	console.log("CONTINUE");
});

(async () => {
	try {
		// not connected!
		await nabii.v1.User.getAll();
	} catch (err) {
		console.log("throw!");
	}
})();
```

```shell
> "wait..."
// 3 seconds later
> "CONTINUE"
> "throw!"
```

#### Add Nabii SDK event listener 👂

```tsx
import nabii from "nabii-sdk";

nabii.v1
	.addEventListener("login", cred => {
		console.log(cred.user?.email);
	})
	.addEventListener("logout", () => console.log("Bye!"));

await nabii.v1.Auth.login("ulyssedupont2707@gmail.com", "testtest", 10);
await nabii.v1.Auth.logout();
```

```shell
> "ulyssedupont2707@gmail.com"
> "Bye!"
```

#### Remove Nabii SDK event listener ❌👂

```tsx
import nabii from "nabii-sdk";

nabii.v1
	.removeEventListener("login", cred => {
		console.log(cred.user?.email);
	})
	.removeEventListener("logout", () => console.log("Bye!"));

await nabii.v1.Auth.login("my_email", "my_password", 10);
await nabii.v1.Auth.logout();
```

### Catch a Nabii error 🔗

```tsx
import nabii, { NabiiError } from "nabii-sdk";

try {
	await nabii.v1.User.getAll();
} catch (err) {
	if (err instanceof NabiiError) {
		console.log(err.message);
		console.log(err.response?.status);
	}
}
```

```shell
> `Erreur interne du SDK : Vous devez être connecté pour accéder à cette méthode: (method: "getAll", file: "/path/index.ts:5:25")`
> 412
```

## Authentification 🧑‍💻

### Login to Nabii ✅

```tsx
import nabii from "nabii-sdk";

const { accessToken } = await nabii.v1.Auth.login(
	"my_email",
	"my_password",
	99,
);
console.log(typeof accessToken);
```

```shell
> "string"
```

### Check connection state ☑️

```tsx
import nabii from "nabii-sdk";

const isLogged = nabii.v1.Auth.isLogged();
console.log(isLogged);
```

```shell
> true
```

### Get login credentials 🧑‍💻

```tsx
import nabii from "nabii-sdk";

if (nabii.v1.Auth.isLogged()) {
	const { accessToken } = nabii.v1.Auth.getCredentials();
	console.log(accessToken);
}
```

```shell
> "..."
```

### Set login credentials 🧑‍💻

```tsx
import nabii from "nabii-sdk";
import storageService from "service/storage";

const { accessToken } = await nabii.v1.Auth.setCredentials({
	accessToken: storageService.get("accessToken"),
	refreshToken: storageService.get("refreshToken"),
	user: storageService.get("user"),
});

console.log(accessToken);
```

```shell
> "..."
```

### Get login user profile 👤

```tsx
import nabii from "nabii-sdk";

const { email } = await nabii.v1.Auth.me();

console.log(email);
```

```shell
> "my_email@nabii.com"
```

## Socket 🧦

### Check socket connection state ☑️

```tsx
import nabii from "nabii-sdk";

const isLogged = nabii.v1.Socket.isLogged();
console.log(isLogged);
```

```shell
> true
```

### Emit socket event to server ⬆️

```tsx
import nabii from "nabii-sdk";

nabii.v1.Socket.emit("ping");
```

### Listen to socket event from server ⬇️

```tsx
import nabii from "nabii-sdk";

nabii.v1.Socket.on("pong", console.log);
nabii.v1.Socket.emit("ping");
```

```shell
> "pong"
```

## Versioning

#### Get all versions 🔢

```tsx
import nabii from "nabii-sdk";

await nabii.v1.Version.Admin.getAll();
```

```shell
> {
		data: [...],
		...
	}
```

#### Create a new version 🔢

```tsx
import nabii from "nabii-sdk";

await nabii.v1.Version.Admin.create({
	type: "minor",
	note: "This is a new minor version!",
});
```

```shell
> {
		id: ...,
		...
	}
```

#### Check if my version is the `latest` 🔢

```tsx
import nabii from "nabii-sdk";

await nabii.v1.Version.check("1.1.0");
```

```shell
> {
		isLatest: false,
		current: {...},
		latest: {...},
	}
```

### ...and more ! ✌️

---

## How to dev ? 🤔

This project recommends using `pnpm` for dependency management to ensure a consistent and optimized setup. If you haven't already, you can install it globally:

````bash
npm install -g pnpm

- Install [pnpm](https://pnpm.io/installation)
- Clone repository
- Open CLI
- Run:

```shell
pnpm i
````

- Install extension:
  - [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for the code formatting
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for the code checking
  - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) for Git history
  - [Prettify](https://marketplace.visualstudio.com/items?itemName=MylesMurphy.prettify-ts) (recommended) to improve type visibility

You may have strict code now.

### Pre-requirement 🔩

- Copy `.env.example` file to create `.env` file
- Add the following environment variables:

```env
# nabii v1
NABII_URL_V1="..." # your nabii server URL for nabii v1
LOGIN_EMAIL_V1="..." # your nabii account email for nabii v1
LOGIN_PASSWORD_V1="..." # your nabii account password for nabii v1
# ------ OPTIONAL EMAIL SMTP ENVIRONMENT ------
GOOGLE_EMAIL_V1="..." # google app email from a first google account for nabii v1 (optional)
GOOGLE_PASSWORD_V1="..." # google app password from a first google account for nabii v1 (optional)
SMTP_EMAIL_V1="..." # your Nabii SMTP email address for nabii v1 (optional)
GOOGLE_EMAIL_BIS_V1="..." # google app email from a second google account for nabii v1 (optional)
GOOGLE_PASSWORD_BIS_V1="..." # google app password from a second google account for nabii v1 (optional)
```

⚠️⚠️⚠️ Without this `.env` file you will not be able to make your commit and push your code ! ⚠️⚠️⚠️

> `OPTIONAL EMAIL SMTP ENVIRONMENT`
> For the two Google accounts, you need to add POP/IMAP protocole on your mailing box : https://support.google.com/mail/answer/7104828
> And also add application password generaterd for the SDK login : https://myaccount.google.com/apppasswords

---

### Commands 🕹

#### Run all unit tests 🧪

```shell
pnpm test
```

#### Run unit tests for a specific module 🧪

```shell
pnpm test:model
```

#### Open unit tests coverage 🧪

```shell
pnpm test:coverage
```

#### Build project dist folder 📦

```shell
pnpm build
```

#### Prettier fix code format 👨‍⚕️

```shell
pnpm format
```

#### Eslint check code format ✅

```shell
pnpm lint
```

#### Update all package version ♻

```shell
pnpm update
```

#### Create a new model 🆕

```shell
pnpm generate:model
```

#### Run demo script 🏗️

```shell
pnpm demo
```

### Architecture 🏗

```
/nabii-sdk
    --/demo: demo scripts
    --/dist: build directory
    --/src
				--form.ts: Nabii sdk form-data gestion
        --instance.ts: Nabii versioning for instances
				--index.ts: Nabii entry point for global exports
        --v1/
            --modules/
                --auth/
                    --auth.ts: type definition for authentication module
                    --auth.sdk.ts: authentication module
                --user/
                    ...
                .../ and more...
            --types/
                --nabii.ts: Nabii v1 typing definition
                --utils.ts: toolkit for nabii SDK typing
            --decorators.ts: TypeScript decorators
            --index.ts: main file
            --base.ts: abstract base class
            --error.ts: Axios Error override
            --mixins.ts: apply mixins to nabii modules
    --/tests: unit tests
    --/utils: utility functions

```

---

### How to create a new Brick ? 🆕

- Run:

```shell
pnpm generate:model
```

- Enter model name (in uppercase)
- Choose nabii version
- Confirm
- Go to folder: "src" ➡ <<a>version</a>> ➡ "modules" ➡ <<a>model-name</a>>
- Enjoy !

## Contact 📧

Author: [Ulysse Dupont](https://www.linkedin.com/in/ulysse-dupont-994848197)

Email: ulyssedupont2707@gmail.com

![https://t4.ftcdn.net/jpg/05/08/80/19/360_F_508801991_UTsCAOorx25USitqonfRADueJlzyjhDq.jpg](https://t4.ftcdn.net/jpg/05/08/80/19/360_F_508801991_UTsCAOorx25USitqonfRADueJlzyjhDq.jpg)
