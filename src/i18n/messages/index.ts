import type { LanguageCode } from "@/i18n/languages";
import type { Messages } from "./types";
import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";

export const MESSAGES: Record<LanguageCode, Messages> = { pt, en, es };
export type { Messages } from "./types";
