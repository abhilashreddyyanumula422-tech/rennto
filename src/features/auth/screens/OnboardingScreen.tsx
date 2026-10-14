import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Onboarding: undefined;
  OwnerRegistration: undefined;
  TenantRegistration: undefined;
  Login: undefined;
};

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Rennto</Text>
      <Text style={styles.subtitle}>Choose your role to get started.</Text>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => navigation.navigate('OwnerRegistration')}
      >
        <Text style={styles.primaryButtonText}>Continue as Owner</Text>
        <Text style={styles.subtext}>Manage your properties and tenants.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('TenantRegistration')}
      >
        <Text style={styles.secondaryButtonText}>Continue as Tenant</Text>
        <Text style={styles.subtextDark}>Find and rent properties easily.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginContainer}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtextDark: {
    color: '#666',
    fontSize: 14,
  },
  loginContainer: {
    padding: 16,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  }
});
