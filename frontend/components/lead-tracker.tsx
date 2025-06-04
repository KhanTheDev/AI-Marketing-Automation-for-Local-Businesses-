"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface LeadTrackerProps {
  businessId?: string
  source?: string
  campaign?: string
}

export function LeadTracker({ businessId, source, campaign }: LeadTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Generate a visitor ID if one doesn't exist
    let visitorId = localStorage.getItem("marketmate_visitor_id")
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem("marketmate_visitor_id", visitorId)
    }

    // Track page view
    const trackPageView = async () => {
      try {
        // Get UTM parameters from URL
        const urlParams = new URLSearchParams(window.location.search)
        const utmSource = urlParams.get("utm_source") || source || "direct"
        const utmMedium = urlParams.get("utm_medium") || "website"
        const utmCampaign = urlParams.get("utm_campaign") || campaign || "none"

        // Get referrer
        const referrer = document.referrer || "direct"

        await fetch("/api/track-lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            businessId: businessId || "default",
            page: pathname,
            timestamp: new Date().toISOString(),
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
            referrer,
            userAgent: navigator.userAgent,
          }),
        })
      } catch (error) {
        console.error("Error tracking page view:", error)
      }
    }

    trackPageView()

    // Set up click tracking
    const trackClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if the click is on a button, link, or has data-track attribute
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("[data-track]") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        const element = target.closest("[data-track]") || target
        const trackId = element.getAttribute("data-track") || element.id || element.tagName
        const trackText = element.textContent?.trim().substring(0, 50) || "unknown"

        try {
          await fetch("/api/track-lead-action", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visitorId,
              businessId: businessId || "default",
              page: pathname,
              element: trackId,
              elementText: trackText,
              timestamp: new Date().toISOString(),
              action: "click",
            }),
          })
        } catch (error) {
          console.error("Error tracking click:", error)
        }
      }
    }

    // Add click event listener
    document.addEventListener("click", trackClick)

    // Clean up
    return () => {
      document.removeEventListener("click", trackClick)
    }
  }, [pathname, businessId, source, campaign])

  return null // This component doesn't render anything
}
