import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from './src/features/auth/screens/OnboardingScreen';
import OwnerRegistrationScreen from './src/features/auth/screens/OwnerRegistrationScreen';
import TenantRegisterScreen from './src/features/auth/screens/TenantRegisterScreen';
import TenantVerificationScreen from './src/features/auth/screens/TenantVerificationScreen';
import TenantHomeScreen from './src/features/dashboard/screens/TenantHomeScreen';
import TenantIssuesScreen from './src/features/issues/screens/TenantIssuesScreen';
import TenantPaymentScreen from './src/features/payments/screens/TenantPaymentScreen';
import TenantProfileScreen from './src/features/users/screens/TenantProfileScreen';
import OwnerLoginScreen from './src/features/auth/screens/OwnerLoginScreen';

import { LanguageProvider } from './src/utils/LanguageContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="OwnerRegistration" component={OwnerRegistrationScreen} />
          <Stack.Screen name="TenantRegistration" component={TenantRegisterScreen} />
          <Stack.Screen name="TenantVerification" component={TenantVerificationScreen} />
          <Stack.Screen name="TenantDashboard" component={TenantHomeScreen} />
          <Stack.Screen name="TenantIssues" component={TenantIssuesScreen} />
          <Stack.Screen name="TenantPayment" component={TenantPaymentScreen} />
          <Stack.Screen name="TenantProfile" component={TenantProfileScreen} />
          <Stack.Screen name="Login" component={OwnerLoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
