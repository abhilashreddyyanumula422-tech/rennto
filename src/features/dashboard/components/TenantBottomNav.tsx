import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface TenantBottomNavProps {
  activeTab: 'home' | 'payment' | 'issues' | 'profile';
}

export default function TenantBottomNav({ activeTab }: TenantBottomNavProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TenantDashboard')}
      >
        <Feather
          name="home"
          size={22}
          color={activeTab === 'home' ? '#6D28D9' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'home' && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Payment Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TenantPayment')}
      >
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={22}
          color={activeTab === 'payment' ? '#6D28D9' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'payment' && styles.tabLabelActive,
          ]}
        >
          Payment
        </Text>
      </TouchableOpacity>

      {/* Issues Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TenantIssues')}
      >
        <View
          style={[
            styles.issuesIconWrapper,
            activeTab === 'issues' && styles.issuesIconWrapperActive,
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle"
            size={22}
            color={activeTab === 'issues' ? '#6D28D9' : '#94A3B8'}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'issues' && styles.tabLabelActive,
          ]}
        >
          Issues
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TenantProfile')}
      >
        <Feather
          name="user"
          size={22}
          color={activeTab === 'profile' ? '#6D28D9' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'profile' && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 76 : 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 14 : 4,
    paddingTop: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  issuesIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  issuesIconWrapperActive: {},
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#6D28D9',
    fontWeight: '700',
  },
});
