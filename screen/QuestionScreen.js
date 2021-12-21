import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Input,
  Button,
} from "@ui-kitten/components";
import { useIsFocused } from "@react-navigation/native";
import firebaseApp from "../config/firebase";
import * as firebase from "firebase/app";

const db = firebaseApp.firestore();

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const QuestionScreen = ({ route, navigation }) => {
  /* 2. Get the param */
  const {
    nameForm,
    limitQuestions,
    idQuestion,
    responsable,
    commerce,
    idAnswer,
  } = route.params;

  const isFocused = useIsFocused();

  const [quest, setQuest] = useState({});
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getQuestion();
      deleteOldAnswer();
    }
  }, [idQuestion, isFocused]);

  const getQuestion = () => {
    db.collection("questions")
      .where("id", "==", `${nameForm}-${idQuestion}`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setAnswers(
            doc
              .data()
              .evaluate.map((e) => e.id)
              .reduce((obj, arrValue) => ((obj[arrValue] = ""), obj), {})
          );
          setQuest(doc.data());
          setLoading(true);
        });
      });
  };

  const navigateNextQuestion = () => {
    let nextQuestion = idQuestion + 1;
    let answer = {
      question: `${nameForm}-${idQuestion}`,
      scores: answers,
    };

    finishQuestion(answer);

    if (nextQuestion <= limitQuestions) {
      navigation.push("Question", {
        nameForm,
        limitQuestions,
        idQuestion: nextQuestion,
        responsable,
        commerce,
        idAnswer,
      });
    } else {
      navigation.navigate("Section", {
        responsable,
        commerce,
      });
    }
  };

  const deleteOldAnswer = () => {
    let oldAnswer = {
      question: `${nameForm}-${idQuestion}`,
      scores: answers,
    };

    db.collection("commerce-answers")
      .doc(idAnswer)
      .update({
        answers: firebase.firestore.FieldValue.arrayRemove(oldAnswer),
      });
  };

  const finishQuestion = (answer) => {
    db.collection("commerce-answers")
      .doc(idAnswer)
      .update({
        answers: firebase.firestore.FieldValue.arrayUnion(answer),
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
        <ScrollView>
          <TopNavigation
            title="YELSAN"
            alignment="center"
            accessoryLeft={BackAction}
          />
          <Divider />
          <Layout style={{ flex: 1, margin: 10 }} level="2">
            <View style={{ margin: 5 }}>
              <View style={{ marginBottom: 5 }}>
                <Text category="h4">{quest.section}</Text>
              </View>
              <Text category="p1">{`${quest.id}: ${quest.question}`}</Text>
              <Divider />
              <View style={{ marginTop: 5, marginBottom: 5 }}>
                {quest.evaluate.map((o) => {
                  if (o.status) {
                    return (
                      <View key={o.id}>
                        <Text category="p1">{o.title}</Text>
                        <Input
                          placeholder="Place your Text"
                          value={answers[o.id]}
                          keyboardType="numeric"
                          onChangeText={(nextValue) =>
                            setAnswers({ ...answers, [o.id]: nextValue })
                          }
                        />
                      </View>
                    );
                  }
                })}
              </View>
              <Button onPress={navigateNextQuestion}>NEXT</Button>
            </View>
          </Layout>
        </ScrollView>
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
