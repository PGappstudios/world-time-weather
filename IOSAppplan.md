# World Time & Weather iOS App Plan

## Overview
A native iOS application that allows users to track time zones and weather across multiple global locations, with a beautiful SwiftUI interface and native iOS features.

## Tech Stack & Requirements
- **Minimum iOS Version**: iOS 16.0+
- **Framework**: SwiftUI
- **Architecture**: MVVM + Clean Architecture
- **Dependencies**:
  - Firebase (Authentication, Analytics)
  - RevenueCat (In-App Purchases)
  - CoreData (Local Storage)
  - Combine (Reactive Programming)
  - Swift Package Manager for dependency management

## Design Guidelines
- Follow iOS 16+ HIG (Human Interface Guidelines)
- Support Dynamic Type
- Dark/Light mode support
- iPad support with adaptive layouts
- Support for landscape/portrait orientations
- Haptic feedback for interactions
- Smooth animations for transitions
- Widget support for quick time zone viewing

## Core Features Implementation

### 1. Time Zone Management
```swift
// TimeZone Model
struct TimeZoneInfo: Identifiable, Codable {
    let id: UUID
    let cityName: String
    let timeZoneIdentifier: String
    let latitude: Double
    let longitude: Double
    var offset: Int
    var abbreviation: String
}

// TimeZone View Model
class TimeZoneViewModel: ObservableObject {
    @Published var timeZones: [TimeZoneInfo] = []
    @Published var currentTime: Date = Date()
    private var timer: Timer?
    
    func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            self?.currentTime = Date()
        }
    }
}
```

### 2. Weather Integration
```swift
// Weather Model
struct WeatherInfo: Codable {
    let temperature: Double
    let condition: String
    let humidity: Int
    let windSpeed: Double
    let precipitation: Double
}

// Weather Service Protocol
protocol WeatherService {
    func fetchWeather(latitude: Double, longitude: Double) async throws -> WeatherInfo
}
```

### 3. UI Components

#### Main Tab View Structure
```swift
struct MainTabView: View {
    var body: some View {
        TabView {
            TimeZonesView()
                .tabItem {
                    Label("Time Zones", systemImage: "clock")
                }
            
            WeatherView()
                .tabItem {
                    Label("Weather", systemImage: "cloud.sun")
                }
            
            MeetingPlannerView()
                .tabItem {
                    Label("Meetings", systemImage: "calendar")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}
```

#### Time Zone Card View
```swift
struct TimeZoneCard: View {
    let timeZone: TimeZoneInfo
    @State private var isExpanded = false
    
    var body: some View {
        VStack {
            HStack {
                Text(timeZone.cityName)
                    .font(.title2)
                Spacer()
                Text(formattedTime)
                    .font(.system(.title, design: .rounded))
                    .monospacedDigit()
            }
            
            if isExpanded {
                WeatherInfoView(timeZone: timeZone)
                    .transition(.move(edge: .top))
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 5)
        .onTapGesture {
            withAnimation {
                isExpanded.toggle()
            }
        }
    }
}
```

### 4. Data Persistence
- Use CoreData for storing favorite cities and preferences
- Implement iCloud sync for cross-device support

```swift
// CoreData Model
class PersistenceController {
    static let shared = PersistenceController()
    let container: NSPersistentCloudKitContainer
    
    init() {
        container = NSPersistentCloudKitContainer(name: "WorldTime")
        
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Error: \(error.localizedDescription)")
            }
        }
        
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
}
```

### 5. Widgets Implementation
```swift
struct WorldTimeWidget: Widget {
    private let kind = "WorldTimeWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TimeProvider()) { entry in
            WorldTimeWidgetView(entry: entry)
        }
        .configurationDisplayName("World Time")
        .description("View your favorite time zones at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
```

### 6. Premium Features (RevenueCat)
- Multiple time zone groups
- Advanced meeting planner
- Custom themes
- Widget customization
- Weather alerts
- No ads

```swift
class PurchaseManager: ObservableObject {
    static let shared = PurchaseManager()
    @Published var isPremium = false
    
    func configure() {
        Purchases.configure(withAPIKey: "your-api-key")
    }
    
    func fetchOfferings() async throws -> Offerings? {
        try await Purchases.shared.offerings()
    }
}
```

## App Flow & Navigation

### 1. Onboarding
- Welcome screen with key features
- Location permission request
- Notification permission request
- Premium features preview

### 2. Main Views
1. Time Zones List
   - Drag to reorder
   - Swipe actions for delete/edit
   - Pull to refresh weather
   - Smooth animations

2. Add Time Zone
   - Search with suggestions
   - Recent searches
   - Favorite locations
   - Map selection option

3. Meeting Planner
   - Visual time slot picker
   - Calendar integration
   - Share meeting links
   - Export to calendar

4. Settings
   - Time format (12/24h)
   - Temperature unit
   - Theme selection
   - Notification preferences
   - iCloud sync toggle

## Advanced Features

### 1. Siri Shortcuts
```swift
class SiriShortcutsManager {
    func donateAddTimeZone(city: String) {
        let activity = NSUserActivity(activityType: "com.app.addTimeZone")
        activity.title = "Add \(city) time zone"
        activity.suggestedInvocationPhrase = "Add \(city) time zone"
        activity.isEligibleForPrediction = true
        
        // Add user activity
    }
}
```

### 2. Live Activities
```swift
struct MeetingTimerAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var timeRemaining: Int
        var participantTimeZones: [String]
    }
    
    var meetingName: String
}
```

### 3. Watch Companion App
- Quick time zone viewing
- Meeting notifications
- Complications
- Time zone rotation

## Testing Strategy
1. Unit Tests for ViewModels
2. UI Tests for critical paths
3. Integration tests for API calls
4. Performance testing
5. Localization testing

## Deployment Checklist
- [ ] App Store screenshots
- [ ] App privacy details
- [ ] Localization complete
- [ ] TestFlight testing
- [ ] Marketing page
- [ ] Support documentation
- [ ] Analytics implementation
- [ ] Crash reporting setup

## Future Enhancements
1. AR view for world clock
2. Travel planning integration
3. Business hours overlay
4. Meeting availability finder
5. Flight time integration
6. Weather radar view

## Notes for Implementation
- Prioritize smooth animations and transitions
- Implement proper error handling and offline support
- Focus on accessibility features
- Optimize for battery life
- Cache weather data appropriately
- Use proper logging for debugging
- Implement proper rate limiting for API calls

Remember to maintain a clean, modular architecture that allows for easy feature additions and maintenance. The UI should feel native to iOS while providing enhanced functionality compared to the web version.
