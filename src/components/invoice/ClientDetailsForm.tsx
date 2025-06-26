"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { Client } from "@/types/invoice";

interface ClientDetailsFormProps {
  client: Client;
  onUpdate: (client: Partial<Client>) => void;
}

export const ClientDetailsForm: React.FC<ClientDetailsFormProps> = ({
  client,
  onUpdate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Client Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              value={client.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter client name"
              required
            />
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-email">Email *</Label>
              <Input
                id="client-email"
                type="email"
                value={client.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Phone *</Label>
              <Input
                id="client-phone"
                value={client.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="client-address">Address *</Label>
            <Textarea
              id="client-address"
              value={client.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Enter client address"
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
