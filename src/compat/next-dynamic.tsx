import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';

type DynamicOptions = {
  loading?: ComponentType;
  ssr?: boolean;
};

export default function dynamic<Props extends object>(
  loader: () => Promise<ComponentType<Props>>,
  options: DynamicOptions = {}
) {
  const LazyComponent: LazyExoticComponent<ComponentType<Props>> = lazy(
    async () => ({ default: await loader() })
  );
  const Loading = options.loading ?? (() => null);

  return function DynamicComponent(props: Props) {
    if (options.ssr === false && typeof window === 'undefined') {
      return <Loading />;
    }

    return (
      <Suspense fallback={<Loading />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
