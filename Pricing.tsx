
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        // create stripe portal...
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };
return(
   {/* PRO */}
          <div className="ring-2 ring-indigo-600 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                $5.99
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600">
                / month
              </span>
            </p>

            <Button
              className="bg-indigo-600 w-full text-white shadow-sm hover:bg-indigo-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || isPending}
              onClick={handleUpgrade}
            >
              {isPending || loading
                ? "Loading..."
                : hasActiveMembership
                ? "Manage Plan"
                : "Upgrade to Pro"}
            </Button>

  )
  }
