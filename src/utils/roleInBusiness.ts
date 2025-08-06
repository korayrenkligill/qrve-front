import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import {
  activeUserBusinessesAtom,
  selectedBusinessAtom,
} from "@/store/component/panelStore";
import { globalStore } from "@/store/globalStore";

let roleInBusiness = (): BusinessUserType => {
  const businesses = globalStore.get(activeUserBusinessesAtom);
  const selectedBusiness = globalStore.get(selectedBusinessAtom);

  const role =
    businesses.find((b) => b.business.id === selectedBusiness?.id)?.role || 0;

  return role;
};

export default roleInBusiness;
