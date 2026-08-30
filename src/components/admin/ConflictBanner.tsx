import { Banner } from "@/components/admin/ui/Banner";
import { Button } from "@/components/ui/Button";
import styles from "./ConflictBanner.module.css";

type ConflictBannerProps = {
  onReload: () => void;
};

/** FR-014/FR-017/FR-024: a `409 CONCURRENT_MODIFICATION` — never a silent overwrite. */
export function ConflictBanner({ onReload }: ConflictBannerProps) {
  return (
    <Banner variant="warning" role="alert" className={styles.conflictBanner}>
      <p className={styles.message}>
        Este item foi alterado por outra pessoa nesse meio-tempo. Recarregue para ver a versão mais
        recente antes de tentar salvar novamente.
      </p>
      <Button type="button" variant="secondary" onClick={onReload}>
        Recarregar
      </Button>
    </Banner>
  );
}
