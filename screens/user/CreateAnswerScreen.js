import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  LogBox,
} from "react-native";
// import type {
//   SelectionChangeData,
//   TextChangeData,
// } from 'react-native-cn-quill';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";

import * as answerActions from "../../store/actions/answer";
import HeaderButton from "../../components/UI/HeaderButton";
import TextEditor from "../../components/pocketstack/TextEditor";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const CreateAnswerScreen = (props) => {
  const { qid } = props.route.params;
  const [answer, setAnswer] = useState("");
  const [enablePushContent, setEnablePushContent] = useState(false);

  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(async () => {
    if (answer === "") {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      console.log(answer);
      return;
    }
    console.log(answer);
    dispatch(answerActions.createAnswer(qid, answer));
    props.navigation.goBack();
  }, [dispatch, answer, qid]);

  useEffect(() => {
    props.navigation.setParams({ submit: onSubmitHandler });
  }, [onSubmitHandler]);

  return (
    <KeyboardAvoidingView
      // behavior="position"
      style={{
        flex: 1,
        backgroundColor: "#f1f4f9",
      }}
      // enabled={enablePushContent}
    >
      {/* <View
        style={{
          marginHorizontal: SCREEN_WIDTH / 20,
          marginVertical: SCREEN_HEIGHT / 50,
        }}
      >
        <Text style={{ fontSize: 30, textAlign: "center" }}>
          Write your answers here!
        </Text>
      </View> */}
      <Text
        style={[
          styles.inputIdentifierText,
          {
            marginHorizontal: SCREEN_WIDTH / 10,
            marginTop: 10,
            fontWeight: "bold",
          },
        ]}
      >
        Body
      </Text>
      <TextEditor
        onHtmlChange={({ html }) => setAnswer(html)}
        style={[
          {
            height: 400,
          },
          styles.editorContainer,
        ]}
        onFocus={() => setEnablePushContent(true)}
      />
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {
  const { submit } = navData.route.params ? navData.route.params : null;
  return {
    headerTitleAlign: "center",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="post"
          buttonStyle={{ fontSize: 25 }}
          // iconName="md-checkmark-sharp"
          iconName="send"
          onPress={submit}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    // marginHorizontal: 30,
    // marginVertical: 10,
    borderWidth: 1,
  },
  textbox: {
    height: 40,
    paddingHorizontal: 20,
  },
  editor: {
    flex: 1,
    padding: 0,
    backgroundColor: "white",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  btn: {
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    margin: 3,
  },
  editorContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dfe9f1",
    marginTop: SCREEN_HEIGHT / 40,
    marginHorizontal: SCREEN_WIDTH / 20,
    overflow: "hidden",
    backgroundColor: "white",
  },
  inputIdentifierText: {
    color: "#708999",
    fontWeight: "bold",
  },
});

export default CreateAnswerScreen;
