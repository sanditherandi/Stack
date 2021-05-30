import React, { useState, useCallback, createRef, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  ActivityIndicator,
  LogBox,
  View,
  Modal,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";

import * as answerActions from "../../store/actions/answer";
import HeaderButton from "../../components/UI/HeaderButton";
import RichTextEditor from "../../components/pocketstack/RichTextEditor";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const CreateAnswerScreen = (props) => {
  const { aid, body } = props.route.params;
  const [answer, setAnswer] = useState(body);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(
    async (answer) => {
      if (answer === "") {
        Alert.alert("", "Wrong input! Please check the errors in the form.", [
          { text: "Okay" },
        ]);
        console.log(answer);
        return;
      }
      try {
        setModalVisible(true);
        await dispatch(answerActions.editAnswer(aid, answer));
        setModalVisible(false);
        Alert.alert("", "Answer was edited successfully!", [
          { text: "okay" },
          {
            text: "return",
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]);
      } catch (err) {
        setModalVisible(false);
        Alert.alert("", "An error occured!", [{ text: "okay" }]);
      }
    },
    [dispatch, answer, aid, setModalVisible]
  );

  useEffect(() => {
    props.navigation.setParams({ submit: onSubmitHandler, newAnswer: answer });
  }, [onSubmitHandler]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f4f9",
      }}
    >
      <Modal
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <View
          style={{
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#43516c" />
        </View>
      </Modal>
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
      <RichTextEditor
        initialContentHTML={answer}
        onChange={(html) => setAnswer(html)}
      />
    </View>
  );
};

export const screenOptions = (navData) => {
  const { submit, newAnswer } = navData.route.params
    ? navData.route.params
    : null;
  return {
    headerTitle: "Edit Answer",
    headerTitleAlign: "center",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="post"
          buttonStyle={{ fontSize: 25 }}
          // iconName="md-checkmark-sharp"
          iconName="send"
          onPress={() => {
            submit(newAnswer);
          }}
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
