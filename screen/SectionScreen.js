import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Button,
} from "@ui-kitten/components";
import firebaseApp from "../config/firebase";

const db = firebaseApp.firestore();

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const SectionScreen = ({ navigation, route }) => {
  const { responsable, commerce } = route.params;

  const [form1, setForm1] = useState({});
  const [form2, setForm2] = useState({});
  const [form3, setForm3] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLimitQuestion();
  }, []);

  const getLimitQuestion = () => {
    db.collection("forms-audit")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          switch (doc.data().id) {
            case "f1":
              setForm1(doc.data());
              break;
            case "f2":
              setForm2(doc.data());
              break;
            case "f3":
              setForm3(doc.data());
              break;
            default:
              console.error("Error: not found form in collection forms-audit");
              break;
          }
          setLoading(true);
        });
      });
  };

  const openQuestions = (form) => {
    db.collection("commerce-answers")
      .where("nameForm", "==", form.id)
      .where("responsable", "==", responsable)
      .where("commerce", "==", commerce)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });

        db.collection("commerce-answers")
          .add({
            responsable,
            commerce,
            nameForm: form.id,
            answers: [],
          })
          .then((docRef) => {
            navigation.navigate("Question", {
              nameForm: form.id,
              limitQuestions: form.questions,
              idQuestion: 1,
              responsable,
              commerce,
              idAnswer: docRef.id,
            });
          });
      });
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="YELSAN"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text category="h6">AUDITORIA DE SEGURIDAD ALIMENTARIA</Text>
          <Button onPress={() => openQuestions(form1)}>COMENZAR</Button>
          <Text category="h6">AUDITORIA DE SEGURIDAD ALIMENTARIA II</Text>
          <Button onPress={() => openQuestions(form2)}>COMENZAR</Button>
          <Text category="h6">AUDITORIA DE SEGURIDAD E HIGIENE</Text>
          <Button onPress={() => openQuestions(form3)}>COMENZAR</Button>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="YELSAN"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h5">LOADING...</Text>
      </Layout>
    </SafeAreaView>
  );
};
