import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TenantBottomNav from '../../dashboard/components/TenantBottomNav';

export default function TenantPaymentScreen() {
  const transactions = [
    { id: '1', title: 'Monthly Rent - Oct 2026', amount: '₹32,000', status: 'Paid', date: '01 Oct 2026' },
    { id: '2', title: 'Maintenance Fee', amount: '₹2,500', status: 'Paid', date: '01 Oct 2026' },
    { id: '3', title: 'Security Deposit', amount: '₹64,000', status: 'Paid', date: '15 Sep 2026' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.workspaceLabel}>PAYMENTS</Text>
          <Text style={styles.screenTitle}>Rent & Payments</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Due Banner */}
          <View style={styles.dueCard}>
            <Text style={styles.dueLabel}>Upcoming Rent Due</Text>
            <Text style={styles.dueAmount}>₹32,000</Text>
            <Text style={styles.dueDate}>Due on 01 Nov 2026</Text>
            <TouchableOpacity style={styles.payNowBtn}>
              <Text style={styles.payNowBtnText}>Pay Rent Now</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Payment History</Text>
          {transactions.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="arrow-up-right" size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyAmount}>{item.amount}</Text>
                <Text style={styles.historyStatus}>{item.status}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <TenantBottomNav activeTab="payment" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  workspaceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 20,
  },
  dueCard: {
    backgroundColor: '#6D28D9',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
  },
  dueLabel: {
    color: '#E9D5FF',
    fontSize: 13,
    fontWeight: '600',
  },
  dueAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 4,
  },
  dueDate: {
    color: '#EDE9FE',
    fontSize: 13,
    marginBottom: 16,
  },
  payNowBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  payNowBtnText: {
    color: '#6D28D9',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  historyDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
});
