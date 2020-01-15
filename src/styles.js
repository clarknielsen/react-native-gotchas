import {StyleSheet, Dimensions} from "react-native";

// color vars
const BG_COLOR = "#ff2e2d";
const BTN_COLOR = "#1c567a";
const BTN_BORDER_COLOR = "#223566";

// responsive font sizes
const perc = (x) => {
  return Math.round(x / 100 * Dimensions.get("window").width);
};

export default StyleSheet.create({
  // main
  textView: {
    fontFamily:"OpenSans-Regular", 
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: perc(5)
  },
  buttonText: {
    textShadowColor: "black",
    textShadowRadius: perc(2.5)
  },
  body: {
    flex: 1,
    backgroundColor: BG_COLOR
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: .1
  },
  // home
  homePage: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch",
    padding: "4%"
  },
  homeOption: {
    backgroundColor: BTN_COLOR,
    width: "42%",
    margin: "4%",
    alignContent: "stretch",
    justifyContent: "center",
    borderColor: BTN_BORDER_COLOR,
    borderWidth: 1
  }
});