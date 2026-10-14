import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TenantBottomNav from '../components/TenantBottomNav';

export default function TenantHomeScreen() {
  const navigation = useNavigation<any>();

  const categories = [
    { id: '1', name: 'Apartment', icon: 'office-building' },
    { id: '2', name: 'Villa', icon: 'home-modern' },
    { id: '3', name: 'Studio', icon: 'home-variant' },
    { id: '4', name: 'Shared', icon: 'account-group' },
  ];

  const featuredProperties = [
    {
      id: '1',
      title: 'Skyline Luxury Suite',
      location: 'Indiranagar, Bangalore',
      price: '₹32,000/mo',
      bhk: '2 BHK',
      rating: '4.9',
      tag: 'Verified',
    },
    {
      id: '2',
      title: 'Green Valley Penthouse',
      location: 'Koramangala, Bangalore',
      price: '₹48,000/mo',
      bhk: '3 BHK',
      rating: '4.8',
      tag: 'Furnished',
    },
    {
      id: '3',
      title: 'Zen Urban Studio',
      location: 'HSR Layout, Bangalore',
      price: '₹18,500/mo',
      bhk: '1 RK',
      rating: '4.7',
      tag: 'New',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeGreeting}>Welcome Back 👋</Text>
            <Text style={styles.headerTitle}>Tenant Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <Feather name="log-out" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by locality, city or property..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Feather name="sliders" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Hero Banner */}
          <LinearGradient
            colors={['#581C87', '#7C3AED', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTag}>ACTIVE SEARCH</Text>
              <Text style={styles.bannerTitle}>Find Verified Rentals With Zero Brokerage</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
            <MaterialCommunityIcons
              name="home-city-outline"
              size={64}
              color="rgba(255,255,255,0.25)"
              style={{ position: 'absolute', right: 12, bottom: 12 }}
            />
          </LinearGradient>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Property Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.categoryCard, idx === 0 && styles.categoryCardActive]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={idx === 0 ? '#FFFFFF' : '#7C3AED'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    idx === 0 && styles.categoryTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Properties */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {featuredProperties.map((prop) => (
            <View key={prop.id} style={styles.propertyCard}>
              <View style={styles.propertyHeader}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{prop.tag}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{prop.rating}</Text>
                </View>
              </View>

              <Text style={styles.propertyTitle}>{prop.title}</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#94A3B8" />
                <Text style={styles.locationText}>{prop.location}</Text>
              </View>

              <View style={styles.propertyFooter}>
                <View>
                  <Text style={styles.propertyPrice}>{prop.price}</Text>
                  <Text style={styles.bhkText}>{prop.bhk}</Text>
                </View>
                <TouchableOpacity style={styles.viewDetailBtn}>
                  <Text style={styles.viewDetailText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TenantBottomNav activeTab="home" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  welcomeGreeting: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#1E293B',
  },
  filterBtn: {
    backgroundColor: '#7C3AED',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  bannerTag: {
    color: '#E9D5FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 14,
    maxWidth: '80%',
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#6D28D9',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  categoryList: {
    marginBottom: 24,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  categoryCardActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#6D28D9',
    fontSize: 11,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  propertyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C3AED',
  },
  bhkText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  viewDetailBtn: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewDetailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
