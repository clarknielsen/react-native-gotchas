package com.triviaquest;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.media.AudioManager;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TriviaQuest";
  }

  /* Override the onCreate function here */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    /* Add this line to keep the original behavior of onCreate() */
    super.onCreate(savedInstanceState);

    /* This one does the trick */
    this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
  }
}
