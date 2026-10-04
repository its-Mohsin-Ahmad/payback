/**
 * PAYBACK loader barrel.
 *
 * Import from `@/components/loaders` everywhere rather than reaching into the
 * individual modules, so the loading system stays one coherent API.
 */

export {
  /* Primitives */
  LoaderAnnouncer,
  LoaderBar,
  LoaderStages,
  LoaderStatusRing,
  PaybackLoaderMark,
  usePrefersReducedMotion,
  /* Composites */
  PaybackLoader,
  PageLoader,
  ButtonLoader,
  /* Transitions */
  SuccessTransition,
  ErrorState,
  RouteTransition,
  /* Types */
  type LoaderTone,
  type LoaderProgress,
  type LoaderStage,
} from './PaybackLoader';

export {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonHeader,
  SkeletonCard,
  DashboardSkeleton,
  CardsSkeleton,
  ListSkeleton,
  MetricSkeleton,
} from './SkeletonLoader';

export {
  CardLoader,
  TransferLoader,
  PaymentLoader,
  QRScannerLoader,
  BiometricLoader,
  KYCVerificationLoader,
} from './WorkflowLoaders';