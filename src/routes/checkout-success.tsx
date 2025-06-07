import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkoutId = searchParams.get("checkout_id");

  const createGroup = async () => {
    const groupName = localStorage.getItem("pendingGroupName");
    const groupSlug = localStorage.getItem("pendingGroupSlug");

    if (!groupName || !groupSlug) {
      setError(
        "Group information not found. Please try creating the group again."
      );
      return;
    }

    setIsCreatingGroup(true);
    try {
      const result = await authClient.organization.create({
        name: groupName,
        slug: groupSlug,
      });

      if (result.error) {
        setError(
          result.error.message || "Failed to create group after payment."
        );
        return;
      }

      // Clear pending group data
      localStorage.removeItem("pendingGroupName");
      localStorage.removeItem("pendingGroupSlug");

      setGroupCreated(true);
    } catch (error: any) {
      setError(error.message || "Failed to create group after payment.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  useEffect(() => {
    if (checkoutId) {
      // Auto-create group after successful payment
      createGroup();
    }
  }, [checkoutId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        {groupCreated ? (
          <>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Group Created Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment was processed and your group has been created.
            </p>
            <Button onClick={() => navigate("/groups")} className="w-full">
              Go to My Groups
            </Button>
          </>
        ) : isCreatingGroup ? (
          <>
            <div className="animate-spin text-blue-600 text-4xl mb-4">⚪</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Creating Your Group...
            </h1>
            <p className="text-gray-600">
              Payment successful! We're setting up your group now.
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-red-600 text-5xl mb-4">✕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Group Creation Failed
            </h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={createGroup} className="w-full">
                Retry Group Creation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/groups")}
                className="w-full"
              >
                Go to Groups
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-blue-600 text-5xl mb-4">💳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed. Click below to create your group.
            </p>
            <Button onClick={createGroup} className="w-full">
              Create My Group
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
