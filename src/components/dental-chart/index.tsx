"use client";

import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Dent } from "../../lib/types";
import { matureMouthData } from "../../lib/data";
import ContextualMenu from "../../components/contextual-menu";
import { cn } from "../../lib/utils";
import styles from './dental.module.css';

// ------ Portal for click-relative contextual menu ------
interface DentMenuPortalProps {
  clickX: number;
  clickY: number;
  onClose: () => void;
  children: React.ReactNode;
}

function DentMenuPortal({ clickX, clickY, onClose, children }: DentMenuPortalProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className={styles.stateOpen}
      style={{
        position: 'fixed',
        // right edge = clickX (translateX(-100%) shifts left by own width)
        top: clickY,
        left: clickX,
        transform: 'translateX(-100%)',
        zIndex: 99999,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
// ---------------------------------------------------------

interface DentalChartProps {
  initialStates?: Record<string, string>;
  onSave?: (
    modifications: { code: string; type: string }[],
    states: Record<string, string>
  ) => void;
  readOnly?: boolean;
  onChartClick?: () => void;
}

const DentalChart = forwardRef<any, DentalChartProps>(function DentalChart(
  { initialStates = {}, onSave = () => { }, readOnly = false, onChartClick },
  ref
) {
  const [selectedTeeth, setSelectedTeeth] = useState<Dent | null>(null);
  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const [teethStates, setTeethStates] =
    useState<Record<string, string>>(initialStates);

  // Mettre à jour l'état des dents si initialStates change
  useEffect(() => {
    setTeethStates(initialStates);
  }, [initialStates]);

  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);

  const teethIdentify = (teeth: Dent, e: React.MouseEvent) => {
    if (readOnly) {
      if (onChartClick) onChartClick();
      return;
    }
    setSelectedTeeth(teeth);
    setClickCoords({ x: e.clientX, y: e.clientY });
    setShowContextualMenu(true);
  };

  const closeContextualMenu = () => {
    setShowContextualMenu(false);
  };

  const updateTeethType = (code: string, type: string) => {
    setTeethStates((prev) => {
      // Si le type est "normal", on supprime l'entrée pour réinitialiser la dent
      if (type === "normal") {
        const newState = { ...prev };
        delete newState[code];
        return newState;
      }
      // Sinon, on définit le nouveau type
      return {
        ...prev,
        [code]: type,
      };
    });
    setShowContextualMenu(false);
  };

  const getTeethImage = (
    code: string,
    type?: string,
    isTopOrientation?: boolean
  ) => {
    const dentType = teethStates[code] || type || "normal";

    // Choisir l'image appropriée en fonction du type de dent
    let imageUrl = `/dentchart/${code}/${encodeURIComponent(
      `normal ${code}`
    )}.png`;

    // Images spéciales selon le type de dent
    if (dentType === "implant") {
      imageUrl = `/dentchart/implant.png`;
    } else if (dentType === "couronne") {
      // Utilisation du nom de fichier crown avec encodage URL pour les espaces
      imageUrl = `/dentchart/${code}/${encodeURIComponent(
        `crown ${code}`
      )}.png`;
    } else if (dentType === "pontique") {
      // Utilisation de l'image pontic.png pour les pontiques
      imageUrl = `/dentchart/${code}/pontic ${code}.png`;
    } else if (dentType === "dent_temporaire") {
      // Utilisation de l'image milk.png pour les dents temporaires
      imageUrl = `/dentchart/${code}/milk ${code}.png`;
    }

    // Appliquer des effets CSS en fonction du type de dent pour les fallbacks
    const getDentTypeClass = () => {
      switch (dentType) {
        case "absente":
          return styles.teethAbsente;
        case "couronne":
          return styles.teethCouronne;
        case "pontique":
          return styles.teethPontique;
        case "implant":
          return styles.teethImplant;
        case "dent_temporaire":
          return styles.teethDentTemporaire;
        default:
          return styles.teethNormal;
      }
    };

    // Créer une classe spéciale pour l'orientation et la position
    const getPositionClass = () => {
      // Les incisives centrales sont plus grandes
      if (["11", "21", "31", "41"].includes(code)) {
        return styles.scaleUp;
      }
      // Wisdom teeth should be smaller
      if (["18", "28", "38", "48"].includes(code)) {
        return styles.scaleDown;
      }
      // Les molaires sont plus larges
      if (
        [
          "16",
          "17",
          "26",
          "27",
          "36",
          "37",
          "46",
          "47",
        ].includes(code)
      ) {
        return styles.scaleNormal;
      }
      return "";
    };

    return (
      <div className={cn(styles.teethContainer, getPositionClass())}>
        {/* Image réelle de la dent */}
        <div className={cn(dentType === "normal" ? styles.teethNormal : getDentTypeClass(), styles.relative)}>
          <img
            src={imageUrl}
            alt={`Dent ${code}`}
            width={60}
            height={60}
            style={{
              width: dentType === "implant"
                ? "40px"
                : dentType === "pontique"
                  ? (["17", "16", "26", "27", "36", "37", "46", "47"].includes(code)
                    ? "50px"
                    : ["12", "22", "43", "33"].includes(code)
                      ? "30px"
                      : ["41", "42", "31", "32"].includes(code)
                        ? "23px"
                        : "35px")
                  : dentType === "dent_temporaire"
                    ? (["15", "14", "25", "24", "35", "34", "44", "45"].includes(code)
                      ? "55px"
                      : ["13", "23"].includes(code)
                        ? "40px"
                        : ["43", "33"].includes(code)
                          ? "35px"
                          : ["12", "22", "11", "21"].includes(code)
                            ? "38px"
                            : ["41", "31"].includes(code)
                              ? "27px"
                              : "30px")
                    : "auto",
              height: "100px",
              objectFit: "contain",
              objectPosition: (dentType === "pontique" || dentType === "dent_temporaire")
                ? (isTopOrientation ? "bottom" : "top")
                : "center",
              position: "relative",
              zIndex: 0,
              transform:
                dentType === "implant" && isTopOrientation
                  ? "rotate(180deg)"
                  : "none",
            }}
            // Fallback en cas d'image manquante
            onError={(e) => {
              try {
                // Si l'image n'est pas trouvée
                if (dentType === "couronne" || dentType === "pontique" || dentType === "dent_temporaire") {
                  // Pour les couronnes, pontiques et dents temporaires, essayer d'utiliser l'image normale avec un filtre
                  const normalImageUrl = `/dentchart/${code}/${encodeURIComponent(
                    `normal ${code}`
                  )}.png`;
                  e.currentTarget.src = normalImageUrl;

                  // Appliquer un filtre selon le type
                  if (dentType === "couronne") {
                    e.currentTarget.style.filter = "sepia(0.6)";
                  } else if (dentType === "pontique") {
                    e.currentTarget.style.filter =
                      "hue-rotate(60deg) saturate(1.2)";
                  } else if (dentType === "dent_temporaire") {
                    e.currentTarget.style.filter =
                      "hue-rotate(180deg) saturate(0.8) brightness(1.1)";
                  }
                } else {
                  // Pour les autres types, utiliser le fallback texte
                  e.currentTarget.style.display = "none";

                  // Vérifier que l'élément suivant existe avant d'y accéder
                  const sibling = e.currentTarget.nextElementSibling;
                  if (sibling) {
                    // @ts-ignore
                    sibling.style.display = "flex";
                  }
                }
              } catch (error) {
                // En cas d'erreur avec le DOM, on l'ignore silencieusement
                console.log("Erreur lors du traitement de l'image:", error);
              }
            }}
          />
        </div>

        {/* Fallback si aucune image n'est disponible */}
        <div className={cn(styles.fallbackContainer, getDentTypeClass())}>
          {dentType === "normal" && (
            <div className={styles.fallbackText}>{code}</div>
          )}
        </div>

        {/* Suppression de l'indicateur de type de dent actif */}
      </div>
    );
  };

  // Fonction pour collecter et sauvegarder les modifications
  const handleSave = () => {
    const modifications = Object.entries(teethStates).map(([code, type]) => ({ code, type }));
    onSave(modifications, teethStates);
  };

  // Restaurer tous les états dentaires à zéro
  const handleReset = () => {
    setTeethStates({});
    onSave([], {});
  };

  // Exposer les méthodes via la référence
  useImperativeHandle(ref, () => ({
    handleSave,
    handleReset,
  }));

  return (
    <div data-dental-chart>
      <div className={cn(styles.chartContainer, readOnly && styles.noHover)}>
        {matureMouthData.map((item, idx) => (
          <div
            key={`orientation-${idx}`}
            className={cn(
              styles.orientationContainer,
              item.orientation === "top" ? styles.orientationTop : styles.orientationBottom
            )}
            data-orientation={item.orientation}
          >
            {item.data.map((dent, dentIdx) => (
              <div
                key={`dent-group-${dentIdx}`}
                className={cn(
                  styles.dentGroup,
                  dent.label.includes("Incisors") && styles.incisorsGroup,
                  item.orientation === "bottom" ? styles.flexColReverse : "",
                )}
                data-group={dent.label}
              >
                <div className={styles.teethRow}>
                  {dent.teeth.map((teeth) => (
                    <div
                      key={`teeth-${teeth.code}`}
                      className={styles.teethWrapper}
                    >
                      <div
                        className={styles.teethTooltip}
                        data-tooltip={teeth.code}
                      >
                        <div
                          className={cn(
                            styles.dentImage,
                          )}
                          id={`dentimage-${teeth.code}`}
                          title={`Dent ${teeth.code}${teethStates[teeth.code]
                            ? ` (${teethStates[teeth.code]})`
                            : ""
                            }`}
                          onClick={(e) => teethIdentify(teeth, e)}
                        >
                          {getTeethImage(
                            teeth.code,
                            teethStates[teeth.code],
                            item.orientation === "top"
                          )}
                        </div>

                        {/* Replace Popover with custom positioned context menu */}
                        {showContextualMenu && selectedTeeth?.code === teeth.code && clickCoords && (
                          <DentMenuPortal
                            clickX={clickCoords.x}
                            clickY={clickCoords.y}
                            onClose={closeContextualMenu}
                          >
                            <ContextualMenu
                              selectedTeeth={teeth}
                              onSelectTeethType={updateTeethType}
                              onClose={closeContextualMenu}
                            />
                          </DentMenuPortal>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

// DisplayName explicite pour les DevTools
DentalChart.displayName = "DentalChart";

export default DentalChart;