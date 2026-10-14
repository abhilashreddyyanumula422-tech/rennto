import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TenantRegisterScreen() {
  const navigation = useNavigation<any>();
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);
  const nameInputRef = useRef<TextInput | null>(null);

  const handleGetOtp = () => {
    Keyboard.dismiss();
    const cleanedMobile = mobile.trim();
    const cleanedName = fullName.trim();

    if (!cleanedMobile) {
      Alert.alert('Required', 'Please enter your mobile number.');
      return;
    }

    if (cleanedMobile.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!cleanedName) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    setIsLoading(true);

    // Simulate OTP delivery
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtp(['', '', '', '']);
      // Focus the first OTP box after slight delay
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    }, 900);
  };

  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const updatedOtp = [...otp];

    if (numericText.length > 1) {
      // Handle paste
      const pastedDigits = numericText.slice(0, 4).split('');
      pastedDigits.forEach((digit, i) => {
        updatedOtp[i] = digit;
      });
      setOtp(updatedOtp);
      if (pastedDigits.length === 4) {
        handleVerify(updatedOtp.join(''));
      }
      return;
    }

    updatedOtp[index] = numericText;
    setOtp(updatedOtp);

    if (numericText && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 4 digits entered
    const completeCode = updatedOtp.join('');
    if (completeCode.length === 4) {
      handleVerify(completeCode);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpCode?: string) => {
    Keyboard.dismiss();
    const code = otpCode || otp.join('');

    if (code.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits of the OTP.');
      return;
    }

    setIsLoading(true);

    // Simulate verification and proceed to Tenant Dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'TenantDashboard', params: { fullName, mobile } }],
      });
    }, 900);
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp(['', '', '', '']);
  };

  return (
    <ImageBackground
      source={require('../../../../assets/starting.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.65)',
          'rgba(240, 230, 255, 0.68)',
          'rgba(226, 212, 255, 0.72)',
        ]}
        style={StyleSheet.absoluteFill}
      />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Top House Icon Badge */}
              <View style={styles.topIconWrapper}>
                <View style={styles.topIconCircle}>
                  <Image
                    source={require('../../../../assets/rent2.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.title}>Welcome Tenant</Text>
              <Text style={styles.subtitle}>
                {"Let's get you started with your rental search"}
              </Text>

              {/* Central White Card */}
              <View style={styles.card}>
                {/* Shield Icon Badge */}
                <View style={styles.shieldBadge}>
                  <MaterialCommunityIcons name="shield-check" size={28} color="#6D28D9" />
                </View>

                {/* Card Title & Subtitle */}
                <Text style={styles.cardTitle}>
                  {otpSent ? 'Verify OTP' : 'Get Started'}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {otpSent
                    ? `Enter 4-digit code sent to +91 ${mobile}`
                    : 'Enter your mobile number & name to continue'}
                </Text>

                {/* 1. Mobile Input Field */}
                <View
                  style={[
                    styles.inputContainer,
                    isFocused && !otpSent && styles.inputContainerFocused,
                    otpSent && styles.inputContainerDisabled,
                  ]}
                >
                  <Feather
                    name="phone"
                    size={20}
                    color="#7C3AED"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, otpSent && styles.inputTextDisabled]}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={setMobile}
                    editable={!otpSent}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    returnKeyType={otpSent ? 'default' : 'next'}
                    onSubmitEditing={() => nameInputRef.current?.focus()}
                  />
                  {otpSent && (
                    <TouchableOpacity
                      onPress={handleChangeNumber}
                      style={styles.changeBtn}
                    >
                      <Text style={styles.changeBtnText}>Change</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* 2. Full Name Input Field */}
                <View
                  style={[
                    styles.inputContainer,
                    nameFocused && !otpSent && styles.inputContainerFocused,
                    otpSent && styles.inputContainerDisabled,
                  ]}
                >
                  <Feather
                    name="user"
                    size={20}
                    color="#7C3AED"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={nameInputRef}
                    style={[styles.input, otpSent && styles.inputTextDisabled]}
                    placeholder="Enter Your Full Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!otpSent}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    returnKeyType={otpSent ? 'default' : 'done'}
                    onSubmitEditing={otpSent ? undefined : handleGetOtp}
                  />
                </View>

                {/* 4 OTP Digit Boxes (shown after clicking Get OTP) */}
                {otpSent && (
                  <View style={styles.otpSection}>
                    <Text style={styles.otpLabel}>Enter 4-digit OTP</Text>
                    <View style={styles.otpBoxesRow}>
                      {[0, 1, 2, 3].map((index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => {
                            otpRefs.current[index] = ref;
                          }}
                          style={[
                            styles.otpBox,
                            focusedOtpIndex === index && styles.otpBoxFocused,
                            otp[index] ? styles.otpBoxFilled : null,
                          ]}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={otp[index]}
                          onChangeText={(text) => handleOtpChange(text, index)}
                          onKeyPress={(e) => handleOtpKeyPress(e, index)}
                          onFocus={() => setFocusedOtpIndex(index)}
                          onBlur={() => setFocusedOtpIndex(null)}
                          textAlign="center"
                          selectTextOnFocus
                        />
                      ))}
                    </View>

                    <View style={styles.resendRow}>
                      <Text style={styles.resendQuestion}>
                        {"Didn't receive OTP? "}
                      </Text>
                      <TouchableOpacity onPress={handleGetOtp} disabled={isLoading}>
                        <Text style={styles.resendLink}>Resend OTP</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Primary Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.buttonWrapper}
                  onPress={otpSent ? () => handleVerify() : handleGetOtp}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#6318AF', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {otpSent ? 'Verify & Continue' : 'Get OTP'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer Trust Badge */}
              <View style={styles.footerContainer}>
                <Feather
                  name="shield"
                  size={14}
                  color="#6B7280"
                  style={styles.footerIcon}
                />
                <Text style={styles.footerText}>
                  Secure • Fast • Trusted Platform
                </Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#EFE9FB',
  },
  backgroundImageStyle: {
    opacity: 0.42,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIconWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  topIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#260B55',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#260B55',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  shieldBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 18,
  },
  inputContainerFocused: {
    borderColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
  },
  inputContainerDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E1B4B',
    paddingVertical: 0,
  },
  inputTextDisabled: {
    color: '#4B5563',
    fontWeight: '600',
  },
  changeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeBtnText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '700',
  },
  otpSection: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  otpBox: {
    width: 54,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    backgroundColor: '#FAF8FF',
    fontSize: 22,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  otpBoxFocused: {
    borderColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  otpBoxFilled: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  resendQuestion: {
    fontSize: 13,
    color: '#6B7280',
  },
  resendLink: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '700',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientButton: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  footerIcon: {
    marginRight: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});
