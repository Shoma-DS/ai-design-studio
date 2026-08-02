import styles from "./DeviceFrame.module.css";

export function LaptopFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className={styles.wrap}>
      {label && <span className={styles.badge}>{label}</span>}
      <div className={styles.laptop}>
        <div className={styles.laptopScreen}>{children}</div>
      </div>
      <div className={styles.laptopBase} />
    </div>
  );
}

export function PhoneFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className={styles.wrap}>
      {label && <span className={styles.badge}>{label}</span>}
      <div className={styles.phone}>
        <div className={styles.phoneScreen}>{children}</div>
      </div>
    </div>
  );
}
