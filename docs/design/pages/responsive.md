## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile-XS | 559px | Two-column footer collapses to single column |

### Touch Targets

- Pill buttons (`button-primary`, `button-secondary`) maintain a minimum 44px tap height across all viewports — achieved by combining `{typography.button}` 20px line-height with the documented vertical padding.
- Circular icon buttons (`button-icon-circular`) are 40px on desktop and grow to 44px on touch viewports.
- Form input minimum tap target on `/contact/` is 48px high.

### Collapsing Strategy

- **Nav**: desktop horizontal nav with two right-anchored pills collapses to a hamburger overlay below 960px. The two pills (`Contact sales`, `Get started for free`) stay visible on the bar above 560px and stack in the overlay below.
- **Pricing tier grid**: 4-up → 2-up at 960px → 1-up below 768px. The pill toggle stays horizontal and scrolls horizontally if needed below 560px.
- **Color-block sections**: above 768px the section keeps `{spacing.xxl}` of canvas around it so the rounded corners read; below 768px the corners are removed and the block bleeds to viewport edge for a poster effect.
- **Comparison table**: below 960px the matrix collapses into per-tier accordions to avoid horizontal scroll.

### Image Behavior

- Product UI mocks inside color blocks scale proportionally and never crop. Below 768px they shrink rather than reflow.
- Template thumbnails in the home grid use lazy loading and animate in on scroll.
- Sticky-note style FigJam thumbnails maintain their slight off-axis rotation across breakpoints — the rotation is a brand signal, not a desktop-only flourish.