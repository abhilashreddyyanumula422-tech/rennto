import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
  Animated,
  StatusBar,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { useLanguage } from '../../../utils/LanguageContext';
import TenantBottomNav from '../../dashboard/components/TenantBottomNav';

const { width } = Dimensions.get('window');

interface PaymentData {
  propertyName: string;
  ownerName: string;
  ownerPhone: string;
  ownerId: string;
  upiId: string;
  rent: number;
  remaining_balance: number;
  dueDate: string;
  checkIn?: string;
  status: string;
  dueDays: number;
  qrCode?: string;
  txn_ref?: string;
}

interface PaymentReminder {
  id: string;
  title: string;
  message: string;
  type?: 'balance' | 'rejection' | 'success';
  pendingAmount?: number;
  dueDate?: string;
  details?: string;
}

const DEFAULT_PAYMENT_DATA: PaymentData = {
  propertyName: 'Sunrise Apartments - Flat 402',
  ownerName: 'Vikram Sharma',
  ownerPhone: '+91 98765 43210',
  ownerId: 'owner_101',
  upiId: 'vikram.sharma@okaxis',
  rent: 25000,
  remaining_balance: 0,
  dueDate: '2026-11-05',
  checkIn: '2025-01-01',
  status: 'Due Soon',
  dueDays: 5,
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Dvikram.sharma%40okaxis%26pn%3DVikram%20Sharma%26am%3D25000%26cu%3DINR',
  txn_ref: 'TXN_REN_20261015',
};

const DEFAULT_REMINDER: PaymentReminder = {
  id: 'reminder_1',
  title: 'Monthly Rent Reminder',
  message: 'Kindly complete your rent payment for November 2026 before the due date.',
  type: 'balance',
  pendingAmount: 25000,
  dueDate: '05 Nov 2026',
  details: 'Electricity & society maintenance charges are included in this billing cycle.',
};

const PAYMENT_APP_ASSETS: Record<string, { uri: string }> = {
  'Google Pay': { uri: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png' },
  'Paytm': { uri: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' },
  'PhonePe': { uri: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png' },
  'BHIM': { uri: 'https://cdn.iconscout.com/icon/free/png-256/free-bhim-logo-icon-download-in-svg-png-gif-file-formats--payment-app-indian-national-corporation-logos-icons-1747945.png' },
  'PayPal': { uri: 'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
  'Amazon Pay': { uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968144.png' },
  'Apple Pay': { uri: 'https://img.icons8.com/ios-filled/512/apple-pay.png' },
  'WhatsApp Pay': { uri: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' }
};

const upiProviders = [
  { name: 'Google Pay', bgColor: '#DBEAFE' },
  { name: 'Paytm', bgColor: '#E0F2FE' },
  { name: 'PhonePe', bgColor: '#F3E8FF' }
];

const additionalUPIApps = [
  { name: 'Apple Pay', bgColor: '#F1F5F9' },
  { name: 'BHIM', bgColor: '#FFF3E0' },
  { name: 'PayPal', bgColor: '#E3F2FD' },
  { name: 'Amazon Pay', bgColor: '#FFF8E1' },
  { name: 'WhatsApp Pay', bgColor: '#E8F5E9' }
];

const TenantPaymentScreen = () => {
  const { t } = useLanguage();

  // State with default data
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>(DEFAULT_PAYMENT_DATA);
  const [paymentReminder, setPaymentReminder] = useState<PaymentReminder | null>(DEFAULT_REMINDER);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [showMoreAppsModal, setShowMoreAppsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upi' | 'cash'>('upi');
  const [uploading, setUploading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cashDescription, setCashDescription] = useState('');
  const [screenshotDescription, setScreenshotDescription] = useState('');
  const [customAmount, setCustomAmount] = useState(DEFAULT_PAYMENT_DATA.rent.toString());
  const [copying, setCopying] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(30));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '#22C55E';
      case 'verifying': return '#6366F1';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      case 'due tomorrow': return '#3B82F6';
      case 'due today': return '#DC2626';
      case 'due soon': return '#8B5CF6';
      case 'upcoming': return '#6366F1';
      default: return '#64748B';
    }
  };

  const handleUPIPayment = async (app: string) => {
    const targetUpiId = paymentData?.upiId || 'vikram.sharma@okaxis';
    const currentRemaining = (paymentData.remaining_balance && paymentData.remaining_balance > 0)
      ? paymentData.remaining_balance
      : paymentData.rent;
    const paymentAmount = parseFloat(customAmount) || currentRemaining;

    if (paymentAmount <= 0) {
      Alert.alert(t('error') || 'Error', t('amount_must_be_greater_than_0') || 'Payment amount must be greater than 0.');
      return;
    }

    const amount = paymentAmount.toString();
    const name = paymentData.ownerName || 'Property Owner';
    const note = `Rent for ${paymentData.propertyName || 'Property'}`;
    const upiUrl = `upi://pay?pa=${targetUpiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    const schemes: Record<string, string> = {
      'PhonePe': `phonepe://pay?pa=${targetUpiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      'Google Pay': `tez://upi/pay?pa=${targetUpiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      'Paytm': `paytmmp://pay?pa=${targetUpiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
      'BHIM': `bhim://pay?pa=${targetUpiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    };

    const targetUrl = schemes[app] || upiUrl;
    try {
      const canOpen = await Linking.canOpenURL(targetUrl);
      if (canOpen) {
        await Linking.openURL(targetUrl);
      } else {
        const canOpenGeneric = await Linking.canOpenURL(upiUrl);
        if (canOpenGeneric) {
          await Linking.openURL(upiUrl);
        } else {
          Alert.alert(
            t('notice') || 'UPI App',
            `${app} is not available on this device. You can copy the UPI ID (${targetUpiId}) or scan the QR code to make the payment.`
          );
        }
      }
    } catch {
      Linking.openURL(upiUrl).catch(() => {
        Alert.alert(
          t('notice') || 'UPI App',
          `Could not open ${app}. You can copy the UPI ID (${targetUpiId}) or scan the QR code to pay.`
        );
      });
    }
  };

  const handleCashPayment = async () => {
    if (!cashDescription.trim()) {
      Alert.alert(t('error') || 'Error', t('please_enter_description') || 'Please enter a description for the owner.');
      return;
    }

    const currentRemaining = (paymentData.remaining_balance && paymentData.remaining_balance > 0)
      ? paymentData.remaining_balance
      : paymentData.rent;
    const paymentAmount = parseFloat(customAmount) || currentRemaining;

    if (paymentAmount <= 0) {
      Alert.alert(t('error') || 'Error', t('amount_must_be_greater_than_0') || 'Payment amount must be greater than 0.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t('success') || 'Success',
        t('cash_payment_sent_msg') || 'Your message and payment report have been sent to the owner successfully!'
      );
      setCashDescription('');
      setShowSuccessModal(true);
    }, 1000);
  };

  const copyToClipboard = async (text?: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('permission_denied') || 'Permission Denied',
        t('gallery_access_required') || 'Access to gallery is required. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPaymentProof(asset.uri);
      setFileName(asset.fileName || `Payment_${Date.now()}.jpg`);
      setFileSize(asset.fileSize ? (asset.fileSize / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB');
    }
  };

  const handleSendToOwner = async () => {
    if (!paymentProof) {
      Alert.alert(t('error') || 'Error', t('upload_screenshot_first') || 'Please upload a screenshot first.');
      return;
    }

    const currentRemaining = (paymentData.remaining_balance && paymentData.remaining_balance > 0)
      ? paymentData.remaining_balance
      : paymentData.rent;
    const paymentAmount = parseFloat(customAmount) || currentRemaining;

    if (paymentAmount <= 0) {
      Alert.alert(t('error') || 'Error', t('amount_must_be_greater_than_0') || 'Payment amount must be greater than 0.');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setPaymentProof(null);
      setScreenshotDescription('');
      setShowSuccessModal(true);
    }, 1200);
  };

  const getNextDueDate = () => {
    if (!paymentData?.dueDate) return t('no_due_date') || 'No Due Date';
    try {
      const parts = paymentData.dueDate.split('-');
      if (parts.length !== 3) return t('no_due_date') || 'No Due Date';
      const dueDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (isNaN(dueDate.getTime())) return t('no_due_date') || 'No Due Date';
      return dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return t('no_due_date') || 'No Due Date';
    }
  };

  const handleAcknowledgeReminder = () => {
    setReminderModalVisible(false);
    setPaymentReminder(null);
  };

  const handleAcknowledgeSuccess = () => {
    setShowSuccessModal(false);
    setPaymentData((prev) => ({
      ...prev,
      status: 'Paid',
      remaining_balance: 0,
    }));
  };

  const getPaymentAccessibility = () => {
    if (!paymentData) return { enabled: false, message: t('loading') || 'Loading...', subMessage: '' };

    if (paymentData.status === 'Paid') {
      if (paymentData.remaining_balance > 0) {
        return {
          enabled: true,
          message: t('remaining_balance_due') || 'Remaining Balance Due',
          subMessage: `${t('please_pay_remaining') || 'Please pay the remaining amount of'} ₹${paymentData.remaining_balance.toLocaleString()}.`
        };
      }
      return {
        enabled: false,
        message: t('this_month_rent_completed') || 'This month rent was completed',
        subMessage: t('payment_verified_by_owner') || 'Your payment has been verified by the owner.'
      };
    }

    return {
      enabled: true,
      message: t('rent duemsg') || 'This month rent is due',
      subMessage: `${t('complete payment by') || 'Please complete payment by'} ${getNextDueDate()}`
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
        }
      >
        {/* 1. Main Premium Gradient Card */}
        <Animated.View style={[styles.mainCardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={['#5F259F', '#7C3AED', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.propertyBadge}>
                <Ionicons name="business" size={14} color="#FFF" />
                <Text style={styles.propertyBadgeText}>{paymentData?.propertyName || t('property') || 'Property'}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.scanBtn} onPress={() => setQrModalVisible(true)} activeOpacity={0.8}>
                  <Ionicons name="qr-code-outline" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tenantSection}>
              <View style={styles.ownerContactRow}>
                <Text style={styles.ownerText}>{t('owner') || 'Owner'}: {paymentData?.ownerName || 'Property Owner'}</Text>
                {paymentData?.ownerPhone && (
                  <TouchableOpacity
                    style={styles.copyPhoneBtn}
                    onPress={() => copyToClipboard(paymentData.ownerPhone)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call" size={14} color="rgba(255, 255, 255, 0.9)" />
                    <Text style={styles.copyPhoneText}>{paymentData.ownerPhone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.rentSection}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <View>
                  <Text style={styles.rentLabel}>{t('monthly_rent') || 'Monthly Rent'}</Text>
                  <View style={styles.amountContainer}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.amount}>{paymentData?.rent?.toLocaleString() || '0'}</Text>
                  </View>
                </View>

                {paymentData?.remaining_balance > 0 && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.rentLabel, { color: '#FEE2E2' }]}>{t('remaining_balance') || 'Remaining Balance'}</Text>
                    <View style={styles.amountContainer}>
                      <Text style={[styles.currency, { color: '#EF4444' }]}>₹</Text>
                      <Text style={[styles.amount, { color: '#EF4444', fontSize: 28 }]}>
                        {paymentData.remaining_balance.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>{t('due_date') || 'Due Date'}</Text>
                <Text style={styles.footerValue}>{getNextDueDate()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(paymentData?.status) }]}>
                <Text style={styles.statusText}>
                  {paymentData?.status || 'Pending'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Unified Owner Action & Reminder Card */}
        {paymentReminder && (
          <TouchableOpacity
            style={styles.actionRequestCard}
            onPress={() => setReminderModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: paymentReminder.type === 'rejection' ? '#EF4444' : paymentReminder.type === 'success' ? '#10B981' : '#6366F1' }]}>
              <Ionicons
                name={paymentReminder.type === 'rejection' ? 'alert-circle' : paymentReminder.type === 'success' ? 'checkmark-circle' : 'notifications'}
                size={24}
                color="#FFF"
              />
              <View style={styles.actionBadge} />
            </View>
            <View style={styles.actionTextContent}>
              <Text style={styles.actionTitle}>{paymentReminder.title}</Text>
              <View style={styles.actionDetailsRow}>
                {paymentReminder.pendingAmount !== undefined && (
                  <View style={styles.actionDetailItem}>
                    <Text style={styles.actionDetailLabel}>{t('amount') || 'Amount'}:</Text>
                    <Text style={[styles.actionDetailValue, { color: paymentReminder.type === 'rejection' ? '#EF4444' : '#1E293B' }]}>₹{paymentReminder.pendingAmount.toLocaleString()}</Text>
                  </View>
                )}
                {paymentReminder.dueDate && (
                  <View style={styles.actionDetailItem}>
                    <Text style={styles.actionDetailLabel}>{t('due') || 'Due'}:</Text>
                    <Text style={styles.actionDetailValue}>{paymentReminder.dueDate}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionSubtitle} numberOfLines={1}>{paymentReminder.message}</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{t('view') || 'View'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#6366F1" />
            </View>
          </TouchableOpacity>
        )}

        {/* Tab Switcher */}
        {getPaymentAccessibility().enabled && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'upi' && styles.activeTab]}
              onPress={() => setActiveTab('upi')}
              activeOpacity={0.7}
            >
              <Ionicons name="qr-code" size={20} color={activeTab === 'upi' ? '#4F46E5' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'upi' && styles.activeTabText]}>{t('upi_payment') || 'UPI Payment'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'cash' && styles.activeTab]}
              onPress={() => setActiveTab('cash')}
              activeOpacity={0.7}
            >
              <Ionicons name="cash-outline" size={20} color={activeTab === 'cash' ? '#22C55E' : '#64748B'} />
              <Text style={[styles.tabText, activeTab === 'cash' && styles.activeTabText]}>{t('cash_payment') || 'Cash Payment'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Content Area */}
        <View style={[styles.contentCard, !getPaymentAccessibility().enabled && styles.disabledContentCard]}>
          {!getPaymentAccessibility().enabled ? (
            <View style={styles.disabledState}>
              <Ionicons name="lock-closed" size={48} color="#94A3B8" />
              <Text style={styles.disabledTitle}>{t('payment_locked') || 'Payment is Locked'}</Text>
              <Text style={styles.disabledSubtitle}>{getPaymentAccessibility().subMessage}</Text>
            </View>
          ) : activeTab === 'upi' ? (
            <>
              <View style={styles.upiCopyRow}>
                <View style={styles.upiIdInfo}>
                  <Text style={styles.upiIdLabelTab}>{t('upi_id') || 'UPI ID'}</Text>
                  <Text style={styles.upiIdValueTab}>{paymentData?.upiId || 'No UPI ID'}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyIconBtn, copying && styles.copyIconBtnActive]}
                  onPress={() => copyToClipboard(paymentData?.upiId)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={copying ? 'checkmark' : 'copy-outline'} size={20} color={copying ? '#FFF' : '#4F46E5'} />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>{t('pay_using_upi_app') || 'Pay using any UPI App'}</Text>
              <View style={styles.upiGrid}>
                {upiProviders.map((app) => (
                  <TouchableOpacity
                    key={app.name}
                    style={styles.upiItem}
                    onPress={() => handleUPIPayment(app.name)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.upiIconBox}>
                      {PAYMENT_APP_ASSETS[app.name] ? (
                        <Image
                          source={PAYMENT_APP_ASSETS[app.name]}
                          style={styles.upiLogo}
                          resizeMode="contain"
                        />
                      ) : (
                        <Ionicons name="card" size={24} color="#64748B" />
                      )}
                    </View>
                    <Text style={[styles.upiName, (app.name === 'PhonePe' || app.name === 'Google Pay') && { color: '#4F46E5' }]} numberOfLines={1}>
                      {app.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.upiItem}
                  onPress={() => setShowMoreAppsModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.upiIconBox, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#64748B" />
                  </View>
                  <Text style={[styles.upiName, { color: '#64748B' }]} numberOfLines={1}>
                    {t('more') || 'More'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>{t('upload_payment_screenshot') || 'Upload Payment Screenshot'}</Text>

              <View style={styles.digitalInputWrapper}>
                <Text style={styles.inputLabelCompact}>{t('Amount Paid') || 'Amount Paid'}</Text>
                <TextInput
                  style={[styles.digitalNoteInput, { marginBottom: 12, fontWeight: 'bold' }]}
                  placeholder={t('Amount') || 'Amount'}
                  placeholderTextColor="#94A3B8"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="numeric"
                />
                <Text style={styles.inputLabelCompact}>{t('Note (Optional)') || 'Note (Optional)'}</Text>
                <TextInput
                  style={styles.digitalNoteInput}
                  placeholder={t('add_note') || 'Add a note...'}
                  placeholderTextColor="#94A3B8"
                  value={screenshotDescription}
                  onChangeText={setScreenshotDescription}
                />
              </View>

              <TouchableOpacity style={styles.uploadArea} onPress={pickImage} activeOpacity={0.8}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#4F46E5" />
                </View>
                <Text style={styles.uploadTitle}>{t('tap_upload_screenshot') || 'Tap to upload screenshot'}</Text>
                <Text style={styles.uploadSubtitle}>{t('after_payment_upload') || 'After payment, upload your screenshot here'}</Text>
              </TouchableOpacity>

              {paymentProof && (
                <View style={styles.fileCard}>
                  <Image source={{ uri: paymentProof }} style={styles.fileThumbnail} />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{fileName}</Text>
                    <Text style={styles.fileSize}>{fileSize}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setPaymentProof(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendToOwner}
                disabled={uploading}
                activeOpacity={0.85}
              >
                {uploading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.sendBtnText}>{t('send_to_owner') || 'Send To Owner'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.cashContentPremium}>
              <View style={styles.cashHeaderPremium}>
                <View style={styles.cashIconCirclePremium}>
                  <MaterialCommunityIcons name="cash-check" size={40} color="#22C55E" />
                </View>
                <View>
                  <Text style={styles.cashTitlePremium}>{t('i_have_paid_cash') || 'I Have Paid Cash'}</Text>
                  <Text style={styles.cashSubtitlePremium}>{t('report_to_owner') || 'Report your cash payment to the owner'}</Text>
                </View>
              </View>

              <View style={styles.cashInputWrapper}>
                <Text style={styles.inputLabelCompact}>{t('Amount Paid') || 'Amount Paid'}</Text>
                <TextInput
                  style={[styles.cashNoteInput, { marginBottom: 12, fontWeight: 'bold', minHeight: 45 }]}
                  placeholder={t('Amount') || 'Amount'}
                  placeholderTextColor="#94A3B8"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="numeric"
                />
                <Text style={styles.inputLabelCompact}>{t('add payment note') || 'Add Note'}</Text>
                <TextInput
                  style={styles.cashNoteInput}
                  placeholder={t('cash note placeholder') || 'e.g. Paid in person...'}
                  placeholderTextColor="#94A3B8"
                  value={cashDescription}
                  onChangeText={setCashDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.cashSendBtn}
                onPress={handleCashPayment}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  style={styles.cashSendGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color="#FFF" />
                      <Text style={styles.cashSendBtnText}>{t('send_to_owner') || 'Send To Owner'}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer Security Note */}
        <View style={styles.footerNote}>
          <View style={styles.securityItem}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#22C55E" />
            <Text style={styles.securityText}>{t('secure_payment_100') || '100% Secure Payment'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.securityItem}>
            <Ionicons name="lock-closed-outline" size={16} color="#64748B" />
            <Text style={styles.securityText}>{t('data_safe') || 'Your data is safe with us'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Tenant Bottom Nav Bar */}
      <TenantBottomNav activeTab="payment" />

      {/* More Apps Modal */}
      <Modal
        visible={showMoreAppsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMoreAppsModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>{t('more_payment_apps') || 'More Payment Apps'}</Text>
              <TouchableOpacity onPress={() => setShowMoreAppsModal(false)}>
                <Ionicons name="close-circle" size={28} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {additionalUPIApps.map((app) => (
                <TouchableOpacity
                  key={app.name}
                  style={styles.bottomSheetAppItem}
                  onPress={() => {
                    setShowMoreAppsModal(false);
                    handleUPIPayment(app.name);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.bottomSheetAppIcon, { backgroundColor: app.bgColor }]}>
                    {PAYMENT_APP_ASSETS[app.name] ? (
                      <Image source={PAYMENT_APP_ASSETS[app.name]} style={styles.bottomSheetAppLogo} resizeMode="contain" />
                    ) : (
                      <Ionicons name="card" size={24} color="#64748B" />
                    )}
                  </View>
                  <Text style={styles.bottomSheetAppName}>{app.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* QR Modal */}
      <Modal visible={qrModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('scan_qr_to_pay') || 'Scan QR to Pay'}</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>
            <View style={styles.qrWrapper}>
              {paymentData?.qrCode ? (
                <Image
                  source={{ uri: paymentData.qrCode }}
                  style={styles.uploadedQr}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ color: '#64748B', fontSize: 16, textAlign: 'center', paddingVertical: 40 }}>
                  {t('payment_qr_not_available') || 'Payment QR not available.'}
                </Text>
              )}
            </View>
            <Text style={styles.qrName}>{paymentData?.ownerName || 'Property Owner'}</Text>
            <Text style={styles.qrUpi}>{paymentData?.upiId || 'No UPI ID'}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setQrModalVisible(false)}>
              <Text style={styles.closeBtnText}>{t('close') || 'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Reminder Modal */}
      <Modal visible={reminderModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.issueModalContent}>
            <LinearGradient
              colors={paymentReminder?.type === 'rejection' ? ['#EF4444', '#DC2626'] : paymentReminder?.type === 'success' ? ['#10B981', '#059669'] : ['#6366F1', '#4F46E5']}
              style={styles.issueHeaderGradient}
            >
              <Ionicons
                name={paymentReminder?.type === 'rejection' ? 'alert-circle' : paymentReminder?.type === 'success' ? 'checkmark-circle' : 'notifications'}
                size={40}
                color="#FFF"
              />
            </LinearGradient>

            <View style={styles.issueBody}>
              <Text style={styles.issueModalTitle}>{paymentReminder?.title || t('reminder from owner') || 'Reminder from Owner'}</Text>
              <Text style={styles.issueText}>{paymentReminder?.message}</Text>

              <View style={styles.issueInfoGrid}>
                {paymentReminder?.pendingAmount !== undefined && (
                  <View style={styles.issueInfoItem}>
                    <Text style={styles.issueInfoLabel}>{t('pending_amount') || 'Pending Amount'}</Text>
                    <Text style={[styles.issueInfoValue, { color: '#EF4444' }]}>₹{paymentReminder.pendingAmount.toLocaleString()}</Text>
                  </View>
                )}

                {paymentReminder?.dueDate && (
                  <View style={styles.issueInfoItem}>
                    <Text style={styles.issueInfoLabel}>{t('due_date') || 'Due Date'}</Text>
                    <Text style={styles.issueInfoValue}>{paymentReminder.dueDate}</Text>
                  </View>
                )}
              </View>

              {paymentReminder?.details && (
                <View style={styles.issueDetailsBox}>
                  <Text style={styles.issueDetailsLabel}>{paymentReminder?.type === 'rejection' ? t('rejection_reason') || 'Reason' : t('description') || 'Note'}:</Text>
                  <Text style={styles.issueDetailsText}>{paymentReminder.details}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.issueCloseBtn} onPress={handleAcknowledgeReminder} activeOpacity={0.85}>
                <Text style={styles.issueCloseBtnText}>{t('i_understand') || 'I Understand'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={60} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>{t('payment_verified') || 'Payment Submitted!'}</Text>
            <Text style={styles.successMessage}>
              {`Your rent payment report for ${paymentData?.propertyName || 'your property'} has been sent to ${paymentData?.ownerName || 'the owner'}.`}
            </Text>
            <TouchableOpacity style={styles.successOkBtn} onPress={handleAcknowledgeSuccess} activeOpacity={0.85}>
              <Text style={styles.successOkText}>{t('awesome') || 'Awesome!'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 110 },
  mainCardContainer: { margin: 16, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  mainCard: { borderRadius: 24, padding: 24, minHeight: 240, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  propertyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  propertyBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  scanBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  tenantSection: { marginTop: 16 },
  ownerContactRow: { marginTop: 8 },
  ownerText: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  copyPhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  copyPhoneText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, fontWeight: '500', marginLeft: 6 },
  rentSection: { marginTop: 16 },
  rentLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  amountContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2 },
  currency: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 4, marginRight: 4 },
  amount: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
  footerItem: { flex: 1 },
  footerLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 10, textTransform: 'uppercase' },
  footerValue: { color: '#FFF', fontSize: 15, fontWeight: '700', marginTop: 2 },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  actionRequestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  actionTextContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionDetailsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  actionDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionDetailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginRight: 4,
  },
  actionDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    marginRight: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: { backgroundColor: '#F0F7FF', borderWidth: 1, borderColor: '#4F46E5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 8 },
  activeTabText: { color: '#4F46E5' },
  contentCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  disabledContentCard: { opacity: 0.8, backgroundColor: '#F1F5F9' },
  disabledState: { alignItems: 'center', paddingVertical: 40 },
  disabledTitle: { fontSize: 18, fontWeight: 'bold', color: '#475569', marginTop: 16 },
  disabledSubtitle: { fontSize: 14, color: '#94A3B8', marginTop: 8, textAlign: 'center' },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  upiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  upiItem: {
    alignItems: 'center',
    width: '24%',
  },
  upiIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  upiName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  upiLogo: {
    width: 42,
    height: 42,
  },
  uploadArea: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderStyle: 'dashed',
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  uploadTitle: { fontSize: 15, fontWeight: 'bold', color: '#4F46E5' },
  uploadSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4 },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  fileThumbnail: { width: 48, height: 48, borderRadius: 10, marginRight: 12 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  fileSize: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sendBtn: {
    backgroundColor: '#6C2BD9',
    flexDirection: 'row',
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6C2BD9',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  sendBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginTop: 24,
  },
  securityItem: { flexDirection: 'row', alignItems: 'center' },
  securityText: { fontSize: 11, color: '#64748B', marginLeft: 6, fontWeight: '600' },
  divider: { width: 1, height: 18, backgroundColor: '#E2E8F0', marginHorizontal: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 32, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  qrWrapper: { padding: 20, backgroundColor: '#F8FAFC', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  uploadedQr: { width: 220, height: 220, borderRadius: 12 },
  qrName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 20 },
  qrUpi: { fontSize: 14, color: '#64748B', marginTop: 6 },
  closeBtn: { marginTop: 24, backgroundColor: '#F1F5F9', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 16 },
  closeBtnText: { fontSize: 15, fontWeight: 'bold', color: '#475569' },
  successModalContent: { width: width * 0.85, backgroundColor: '#FFF', borderRadius: 32, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 20 },
  successIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  successMessage: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  successOkBtn: { width: '100%', backgroundColor: '#22C55E', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  successOkText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  cashContentPremium: { paddingVertical: 10 },
  cashHeaderPremium: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cashIconCirclePremium: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cashTitlePremium: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  cashSubtitlePremium: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cashInputWrapper: { marginBottom: 20 },
  inputLabelCompact: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  cashNoteInput: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, fontSize: 14, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', textAlignVertical: 'top', minHeight: 80 },
  cashSendBtn: { borderRadius: 16, overflow: 'hidden' },
  cashSendGradient: { flexDirection: 'row', height: 54, justifyContent: 'center', alignItems: 'center', gap: 8 },
  cashSendBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  upiCopyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-between' },
  upiIdInfo: { flex: 1 },
  upiIdLabelTab: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  upiIdValueTab: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  copyIconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  copyIconBtnActive: { backgroundColor: '#22C55E' },
  digitalInputWrapper: { marginBottom: 16 },
  digitalNoteInput: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, fontSize: 14, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', height: 48 },
  issueModalContent: { width: width * 0.85, backgroundColor: '#FFF', borderRadius: 32, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 20 },
  issueHeaderGradient: { padding: 32, alignItems: 'center', gap: 12 },
  issueModalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  issueBody: { padding: 24 },
  issueText: { fontSize: 16, color: '#1E293B', textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  issueInfoGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16 },
  issueInfoItem: { alignItems: 'center' },
  issueInfoLabel: { fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: '600', marginBottom: 4 },
  issueInfoValue: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  issueDetailsBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', marginBottom: 24 },
  issueDetailsLabel: { fontSize: 12, fontWeight: '700', color: '#991B1B', marginBottom: 4, textTransform: 'uppercase' },
  issueDetailsText: { fontSize: 14, color: '#991B1B', lineHeight: 20 },
  issueCloseBtn: { backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  issueCloseBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  bottomSheetAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bottomSheetAppIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bottomSheetAppLogo: {
    width: 24,
    height: 24,
  },
  bottomSheetAppName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
});

export default TenantPaymentScreen;
