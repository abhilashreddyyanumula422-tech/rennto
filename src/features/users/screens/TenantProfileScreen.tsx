 import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TenantBottomNav from '../../dashboard/components/TenantBottomNav';
import { useLanguage } from '../../../utils/LanguageContext';

export default function TenantProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { language, setLanguage, languages, t } = useLanguage();

  // Profile data with fallback to '...' matching the screenshot
  const userName = route.params?.fullName || '...';
  const userPhone = route.params?.mobile || '...';

  // Modal states
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLangTemp, setSelectedLangTemp] = useState(language);

  const handleLogout = async () => {
    setIsLogoutModalVisible(false);
    try {
      await AsyncStorage.removeItem('@tenant_token');
      await AsyncStorage.removeItem('@tenant_user');
    } catch {
      // Ignore errors on clearing
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option to update your profile photo',
      [
        { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera opened') },
        { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Gallery opened') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSupportPress = () => {
    Alert.alert(
      'Rennto Support',
      'How can we help you today?',
      [
        { text: 'Chat with Support', onPress: () => {} },
        { text: 'Call Helpline', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleOpenLanguages = () => {
    setSelectedLangTemp(language);
    setIsLanguageModalVisible(true);
  };

  const handleSelectLanguage = async (code: string) => {
    setSelectedLangTemp(code);
    await setLanguage(code);
    setIsLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Curved Purple Gradient Header */}
          <LinearGradient
            colors={['#250448', '#4A00E0', '#6D28D9']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradientHeader}
          >
            {/* Profile Avatar with Camera Button */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <View style={styles.avatarDot} />
              </View>

              {/* Camera Icon Overlay */}
              <TouchableOpacity
                style={styles.cameraBadge}
                activeOpacity={0.8}
                onPress={handleCameraPress}
              >
                <Feather name="camera" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* User Name */}
            <Text style={styles.userName}>{userName}</Text>

            {/* Resident Pill Badge */}
            <View style={styles.residentBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="rgba(255, 255, 255, 0.85)"
              />
              <Text style={styles.residentText}>{t('resident') || 'Resident'}</Text>
            </View>
          </LinearGradient>

          {/* Body Sections */}
          <View style={styles.bodyContainer}>
            {/* Basic Information Section */}
            <Text style={styles.sectionTitle}>
              {t('basic_information') || 'Basic Information'}
            </Text>
            <View style={styles.infoCard}>
              <View style={styles.phoneIconBox}>
                <Feather name="phone" size={20} color="#10B981" />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>{t('phone') || 'Phone'}</Text>
                <Text style={styles.infoValue}>{userPhone}</Text>
              </View>
            </View>

            {/* Account Actions Section */}
            <Text style={[styles.sectionTitle, { marginTop: 26 }]}>
              {t('account_actions') || 'Account Actions'}
            </Text>
            <View style={styles.actionsCard}>
              {/* 1. Languages Row */}
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={handleOpenLanguages}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <Feather name="globe" size={20} color="#10B981" />
                  </View>
                  <Text style={styles.actionLabel}>
                    {t('languages') || 'Languages'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 2. Request History Row */}
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('TenantIssues')}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Feather name="file-text" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.actionLabel}>
                    {t('request_history') || 'Request History'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 3. Notifications Row */}
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Notifications', 'No new notifications right now.')}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#FFF7ED' }]}>
                    <Feather name="bell" size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.actionLabel}>
                    {t('notifications') || 'Notifications'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 4. Logout Row */}
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => setIsLogoutModalVisible(true)}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
                    <Feather name="log-out" size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.actionLabel}>
                    {t('logout') || 'Logout'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Floating Support Button (FAB) */}
        <TouchableOpacity
          style={styles.fabButton}
          activeOpacity={0.85}
          onPress={handleSupportPress}
        >
          <LinearGradient
            colors={['#4A00E0', '#8E2DE2']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name="face-agent"
              size={28}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.langModalBackdrop}>
          <View style={styles.langModalContainer}>
            {/* Modal Header */}
            <View style={styles.langModalHeader}>
              <View style={styles.langHeaderTitleGroup}>
                <View style={styles.langGlobeIconBox}>
                  <Feather name="globe" size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.langModalTitle}>Select Language</Text>
                  <Text style={styles.langModalSubtitle}>Choose your app language</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsLanguageModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Language Options List */}
            <ScrollView
              style={styles.langList}
              showsVerticalScrollIndicator={false}
            >
              {languages.map((item) => {
                const isSelected = item.code === selectedLangTemp;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.langOptionCard,
                      isSelected && styles.langOptionCardSelected,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => handleSelectLanguage(item.code)}
                  >
                    <View style={styles.langOptionLeft}>
                      <Text
                        style={[
                          styles.langNativeName,
                          isSelected && styles.langNativeNameSelected,
                        ]}
                      >
                        {item.nativeName}
                      </Text>
                      <Text style={styles.langEnglishName}>
                        {item.name}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.langRadioCircle,
                        isSelected && styles.langRadioCircleSelected,
                      ]}
                    >
                      {isSelected && (
                        <View style={styles.langRadioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Dialog Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalDialog}>
            <Text style={styles.modalTitle}>{t('logout') || 'Logout'}</Text>
            <Text style={styles.modalMessage}>
              {t('logout_confirm') || 'Are you sure you want to logout?'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setIsLogoutModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>{t('cancel') || 'CANCEL'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.modalLogoutText}>LOGOUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <TenantBottomNav activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 20 : 64,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(38, 12, 70, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 8,
    letterSpacing: 2,
  },
  residentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  residentText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginLeft: 6,
  },
  bodyContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  phoneIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBox: {
    marginLeft: 14,
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
    letterSpacing: 1,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionLabel: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginLeft: 74,
  },
  fabButton: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 18,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 26,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
  },
  modalBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  modalLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  /* Language Selection Modal Styles */
  langModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  langModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    maxHeight: '75%',
  },
  langModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  langHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langGlobeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  langModalSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langList: {
    marginTop: 6,
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  langOptionCardSelected: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
  },
  langOptionLeft: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  langNativeNameSelected: {
    color: '#6D28D9',
  },
  langEnglishName: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  langRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langRadioCircleSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
  },
  langRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7C3AED',
  },
});
