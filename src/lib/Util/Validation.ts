import { Client, CompanyInfo, ServiceItem } from "@/types";

export function validateCompanyInfo(companyInfo: CompanyInfo): string[] {
  const errors: string[] = [];

  if (!companyInfo.name?.trim()) {
    errors.push("Company name is required");
  }

  if (!companyInfo.email?.trim()) {
    errors.push("Company email is required");
  } else if (
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(companyInfo.email)
  ) {
    errors.push("Invalid company email format");
  }

  if (!companyInfo.phone?.trim()) {
    errors.push("Company phone is required");
  }

  if (!companyInfo.address?.street?.trim()) {
    errors.push("Company street address is required");
  }

  if (!companyInfo.address?.city?.trim()) {
    errors.push("Company city is required");
  }

  if (!companyInfo.address?.state?.trim()) {
    errors.push("Company state is required");
  }

  if (!companyInfo.address?.zipCode?.trim()) {
    errors.push("Company zip code is required");
  }

  return errors;
}

export function validateClient(client: Client): string[] {
  const errors: string[] = [];

  if (!client.name?.trim()) {
    errors.push("Client name is required");
  }

  if (!client.email?.trim()) {
    errors.push("Client email is required");
  } else if (
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(client.email)
  ) {
    errors.push("Invalid client email format");
  }

  if (!client.address?.street?.trim()) {
    errors.push("Client street address is required");
  }

  if (!client.address?.city?.trim()) {
    errors.push("Client city is required");
  }

  if (!client.address?.state?.trim()) {
    errors.push("Client state is required");
  }

  if (!client.address?.zipCode?.trim()) {
    errors.push("Client zip code is required");
  }

  return errors;
}

export function validateServiceItems(serviceItems: ServiceItem[]): string[] {
  const errors: string[] = [];

  if (!serviceItems || serviceItems.length === 0) {
    errors.push("At least one service item is required");
    return errors;
  }

  serviceItems.forEach((item, index) => {
    if (!item.description?.trim()) {
      errors.push(`Service item ${index + 1}: Description is required`);
    }

    if (!item.quantity || item.quantity <= 0) {
      errors.push(`Service item ${index + 1}: Valid quantity is required`);
    }

    if (!item.unitPrice || item.unitPrice < 0) {
      errors.push(`Service item ${index + 1}: Valid unit price is required`);
    }

    if (item.amount < 0) {
      errors.push(`Service item ${index + 1}: Amount cannot be negative`);
    }
  });

  return errors;
}

export function calculateServiceItemAmount(
  quantity: number,
  unitPrice: number
): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}
