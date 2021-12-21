import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Input,
  Text,
} from "@ui-kitten/components";
import { View } from "react-native";

export const HomeScreen = ({ navigation }) => {
  const [responsable, setResponsable] = useState("");
  const [commerce, setCommerce] = useState("");

  const navigateQuestion = () => {
    navigation.navigate("Section", {
      responsable,
      commerce,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="YELSAN" alignment="center" />
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View>
          <Text category="p1">Responsable</Text>
          <Input
            placeholder="Place your Text"
            value={responsable}
            onChangeText={(nextValue) => setResponsable(nextValue)}
          />
          <Text category="p1">Establecimiento</Text>
          <Input
            placeholder="Place your Text"
            value={commerce}
            onChangeText={(nextValue) => setCommerce(nextValue)}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Button onPress={navigateQuestion}>ABRIR FORMULARIOS</Button>
        </View>
      </Layout>
    </SafeAreaView>
  );
};
