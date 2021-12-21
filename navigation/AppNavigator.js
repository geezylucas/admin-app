import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screen/HomeScreen";
import { SectionScreen } from "../screen/SectionScreen";
import { QuestionScreen } from "../screen/QuestionScreen";

const HomeStack = createNativeStackNavigator();
const QuestionsStack = createNativeStackNavigator();

const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Section" component={SectionScreen} />
    <HomeStack.Screen name="Question" component={QuestionScreen} />
  </HomeStack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
