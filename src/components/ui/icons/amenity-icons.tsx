import type { ComponentType } from "react";
import type { AmenityKey } from "@/domain/content";
import type { IconProps } from "./types";
import { WifiIcon } from "./WifiIcon";
import { AirConditioningIcon } from "./AirConditioningIcon";
import { BreakfastIcon } from "./BreakfastIcon";
import { PoolIcon } from "./PoolIcon";
import { PrivateBathroomIcon } from "./PrivateBathroomIcon";
import { MiniFridgeIcon } from "./MiniFridgeIcon";
import { SeaViewIcon } from "./SeaViewIcon";

export const AMENITY_ICONS: Record<AmenityKey, ComponentType<IconProps>> = {
  wifi: WifiIcon,
  airConditioning: AirConditioningIcon,
  breakfast: BreakfastIcon,
  pool: PoolIcon,
  privateBathroom: PrivateBathroomIcon,
  miniFridge: MiniFridgeIcon,
  seaView: SeaViewIcon,
};
