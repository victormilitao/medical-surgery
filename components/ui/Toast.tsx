import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppColors } from '../../constants/colors';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastType, {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  icon: typeof CheckCircle;
}> = {
  success: {
    backgroundColor: AppColors.success.light,
    borderColor: AppColors.success.DEFAULT,
    iconColor: AppColors.success.DEFAULT,
    icon: CheckCircle,
  },
  error: {
    backgroundColor: AppColors.error.light,
    borderColor: AppColors.error.DEFAULT,
    iconColor: AppColors.error.DEFAULT,
    icon: XCircle,
  },
  warning: {
    backgroundColor: AppColors.warning.light,
    borderColor: AppColors.warning.DEFAULT,
    iconColor: AppColors.warning.DEFAULT,
    icon: AlertTriangle,
  },
  info: {
    backgroundColor: AppColors.info.light,
    borderColor: AppColors.info.DEFAULT,
    iconColor: AppColors.info.DEFAULT,
    icon: Info,
  },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const config = TOAST_CONFIG[toast.type];
  const IconComponent = config.icon;
  const duration = toast.duration ?? 3000;

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });

    // Auto-dismiss
    translateY.value = withSequence(
      withTiming(0, { duration: 300 }),
      withDelay(
        duration,
        withTiming(-100, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onDismiss)(toast.id);
          }
        })
      )
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(duration, withTiming(0, { duration: 300 }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderLeftColor: config.borderColor,
        },
        animatedStyle,
      ]}
    >
      <IconComponent size={22} color={config.iconColor} strokeWidth={2} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: AppColors.gray[900] }]}>
          {toast.title}
        </Text>
        {toast.message ? (
          <Text style={[styles.message, { color: AppColors.gray[600] }]}>
            {toast.message}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    marginTop: 2,
  },
});
