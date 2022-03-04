import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../colors";
import { Alert } from "react-native";
import { useDB } from "../context";
import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";

const View = styled.View`
  background-color: ${colors.bgColor};
  flex: 1;
  padding: 0px 30px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;

const TextInput = styled.TextInput.attrs({
  placeholderTextColor: "#a5b1c2",
})`
  background-color: white;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 18px;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  margin-top: 30px;
  background-color: ${colors.btnColor};
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;
const BtnText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

const Emotions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Emotion = styled.TouchableOpacity`
  background-color: white;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  padding: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? "rgba(41, 30, 95, 1);" : "transparent"};
`;

const EmotionText = styled.Text`
  font-size: 24px;
  font-weight: 500;
`;

const emotions = ["🌈", "💧", "⚡️", "☀️", "❄️", "🌪"];

const Write = ({ navigation: { goBack } }) => {
  const realm = useDB();
  const [selectedEmotion, setEmotion] = useState(null);
  const [feelings, setFeelings] = useState("");
  const onChangeText = (text) => setFeelings(text);
  const onEmotionPress = (weather) => setEmotion(weather);
  const onSubmit = async () => {
    if (feelings === "" || selectedEmotion == null) {
      return Alert.alert("Please complete form.");
    }
    await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/1712485313");
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => {
      AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
        realm.write(() => {
          realm.create("Feeling", {
            _id: Date.now(),
            emotion: selectedEmotion,
            message: feelings,
          });
        });
        goBack();
      });
    });
  };
  return (
    <View>
      <Title>How do you feel today?</Title>
      <Emotions>
        {emotions.map((emotion, index) => (
          <Emotion
            selected={emotion === selectedEmotion}
            onPress={() => onEmotionPress(emotion)}
            key={index}
          >
            <EmotionText>{emotion}</EmotionText>
          </Emotion>
        ))}
      </Emotions>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
        value={feelings}
        placeholder="Write your feelings..."
      />
      <Btn onPress={onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
    </View>
  );
};

export default Write;
