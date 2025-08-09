##shortcuts 
rnfes : for react native boilerplate shortcut 


##commands 
npx create-expo-app@latest  #create project 

npx expo start #run project 

npm run reset-project  #reset prject 

npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context 


npx tailwind init

npx expo customize metro.config.js



##Notes 
**_layout.tsx (underscore prefix)**
Special filename in Expo Router

Acts as a default layout wrapper for all sibling and nested routes in the same folder.

Every screen in that folder will be rendered inside whatever <Slot /> you put in _layout.tsx.



**layout.tsx (no underscore)**
Just a normal component file named layout.tsx.

Not automatically recognized as a special wrapper by Expo Router.

It only works as a layout if you explicitly import and use it in your screens.

<Tabs> #create a bottom bar 

<Tabs.Screen> #Represents one tab/page in your app.


() # files nside parenthesis are routes 



























Project based on: https://www.youtube.com/watch?v=f8Z9JyB2EIE&t=1247s


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
