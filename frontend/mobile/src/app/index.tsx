import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { Brand, InterFonts, Radius, Spacing } from '@/constants/theme';

const FIGMA_STATUS_BAR_HEIGHT = 44;
const NAVIGATION_DELAY_MS = 2000;
const SPIN_DURATION_MS = 1000;

export default function SplashScreen() {
  const [rotation] = useState(() => new Animated.Value(0));
  const hasNavigated = useRef(false);

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: SPIN_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();
    return () => spin.stop();
  }, [rotation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasNavigated.current) {
        return;
      }
      hasNavigated.current = true;
      router.replace('/login');
    }, NAVIGATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const spinStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.body}>
        <View style={styles.mark}>
          <Image
            source={require('@/assets/images/splash/check-square.svg')}
            style={styles.markIcon}
            contentFit="contain"
          />
        </View>
        <Text style={styles.title}>ResolveX Staff</Text>
        <Text style={styles.tagline}>Every complaint, owned.</Text>
        <View style={styles.loading}>
          <Animated.View style={[styles.loadingIcon, spinStyle]}>
            <Image
              source={require('@/assets/images/splash/loader.svg')}
              style={styles.loadingIcon}
              contentFit="contain"
            />
          </Animated.View>
          <Text style={styles.loadingText}>Loading your tickets…</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.bgBrand,
    paddingTop: FIGMA_STATUS_BAR_HEIGHT,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  mark: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl2,
    backgroundColor: Brand.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markIcon: {
    width: 44,
    height: 44,
  },
  title: {
    fontFamily: InterFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.12,
    color: Brand.textOnBrand,
  },
  tagline: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textOnBrand,
    opacity: 0.8,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  loadingIcon: {
    width: 18,
    height: 18,
  },
  loadingText: {
    fontFamily: InterFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textOnBrand,
    opacity: 0.8,
  },
});
