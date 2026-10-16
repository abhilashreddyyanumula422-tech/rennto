import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './TenantIssuesScreen.styles';

interface IssueItem {
  id: string;
  title: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export default function TenantIssuesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // New Issue form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Plumbing');
  const [newSeverity, setNewSeverity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDescription, setNewDescription] = useState('');

  const categories = ['Plumbing', 'Electrical', 'Appliance', 'Carpentry', 'Other'];
  const severities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];

  const totalCount = issues.length;
  const highCount = issues.filter((i) => i.severity === 'High').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  const filteredIssues = issues.filter((issue) => {
    if (selectedFilter === 'All') return true;
    return issue.severity === selectedFilter;
  });

  const handleCreateIssue = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter an issue title.');
      return;
    }

    const newIssue: IssueItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      severity: newSeverity,
      status: 'Open',
      createdAt: 'Just now',
    };

    setIssues([newIssue, ...issues]);
    setNewTitle('');
    setNewDescription('');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        {/* Main Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.workspaceLabel}>WORKSPACE</Text>
            <Text style={styles.screenTitle}>Issue Tracker</Text>
          </View>
          <TouchableOpacity
            style={styles.newIssueBtn}
            activeOpacity={0.85}
            onPress={() => setIsModalVisible(true)}
          >
            <Feather name="plus" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.newIssueBtnText}>New Issue</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 3 Metric / Stats Cards Row */}
          <View style={styles.statsRow}>
            {/* Card 1: Total Issues */}
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>TOTAL ISSUES</Text>
            </View>

            {/* Card 2: High Severity */}
            <View style={[styles.statCard, styles.statCardHigh]}>
              <View style={styles.redBar} />
              <View style={styles.statCardInner}>
                <Text style={styles.statValue}>{highCount}</Text>
                <Text style={styles.statLabel}>HIGH SEVERITY</Text>
              </View>
            </View>

            {/* Card 3: Resolved */}
            <View style={[styles.statCard, styles.statCardResolved]}>
              <View style={styles.greenBar} />
              <View style={styles.statCardInner}>
                <Text style={styles.statValue}>{resolvedCount}</Text>
                <Text style={styles.statLabel}>RESOLVED</Text>
              </View>
            </View>
          </View>

          {/* Active Tickets Header & Filter Pills */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Active Tickets</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsRow}
            >
              {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedFilter(filter)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isActive && styles.filterPillTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Empty State or Issue List */}
          {filteredIssues.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrapper}>
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={54}
                  color="#94A3B8"
                />
              </View>
              <Text style={styles.emptyTitle}>No issues found</Text>
              <Text style={styles.emptySubtitle}>
                {"You're all caught up for now."}
              </Text>
            </View>
          ) : (
            <View style={styles.issuesList}>
              {filteredIssues.map((item) => (
                <View key={item.id} style={styles.issueItemCard}>
                  <View style={styles.issueCardTop}>
                    <Text style={styles.issueItemTitle}>{item.title}</Text>
                    <View
                      style={[
                        styles.severityBadge,
                        item.severity === 'High' && styles.severityHigh,
                        item.severity === 'Medium' && styles.severityMedium,
                        item.severity === 'Low' && styles.severityLow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          item.severity === 'High' && styles.severityTextHigh,
                          item.severity === 'Medium' && styles.severityTextMedium,
                          item.severity === 'Low' && styles.severityTextLow,
                        ]}
                      >
                        {item.severity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.issueCardBottom}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                    <Text style={styles.issueDateText}>{item.createdAt}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Modal for Creating New Issue */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report New Issue</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Feather name="x" size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Issue Title Input */}
                <Text style={styles.inputLabel}>Issue Title *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Leaking kitchen sink"
                  placeholderTextColor="#94A3B8"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />

                {/* Category Selection */}
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.chipRow}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        newCategory === cat && styles.chipActive,
                      ]}
                      onPress={() => setNewCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          newCategory === cat && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Severity Selection */}
                <Text style={styles.inputLabel}>Severity Level</Text>
                <View style={styles.chipRow}>
                  {severities.map((sev) => (
                    <TouchableOpacity
                      key={sev}
                      style={[
                        styles.chip,
                        newSeverity === sev && styles.chipActive,
                      ]}
                      onPress={() => setNewSeverity(sev)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          newSeverity === sev && styles.chipTextActive,
                        ]}
                      >
                        {sev}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Description Input */}
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Provide any additional details..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  value={newDescription}
                  onChangeText={setNewDescription}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleCreateIssue}
                >
                  <Text style={styles.modalSubmitBtnText}>Submit Issue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

