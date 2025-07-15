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
  - WorldTimeAPI Integration
  - OpenMeteo API for weather data

## Design Guidelines
- Follow iOS 16+ HIG (Human Interface Guidelines)
- Support Dynamic Type
- Dark/Light mode support
- iPad support with adaptive layouts
- Support for landscape/portrait orientations
- Haptic feedback for interactions
- Smooth animations for transitions
- Widget support for quick time zone viewing
- Accessibility features

## Core Features Implementation

### 1. Time Zone Management
```swift
// TimeZone Model
struct TimeZoneInfo: Identifiable, Codable {
    let id: UUID
    let cityName: String
    let countryName: String
    let timeZoneIdentifier: String
    let latitude: Double
    let longitude: Double
    var offset: Int
    var abbreviation: String
    var isHomeTimeZone: Bool = false
}

// TimeZone View Model
class TimeZoneViewModel: ObservableObject {
    @Published var timeZones: [TimeZoneInfo] = []
    @Published var currentTime: Date = Date()
    @Published var popularCities: [String] = [
        "New York, USA",
        "London, UK",
        "Tokyo, Japan",
        "Paris, France",
        "Sydney, Australia",
        "Dubai, UAE",
        "Singapore, Singapore",
        "Hong Kong, China",
        "Mumbai, India",
        "Seoul, South Korea",
        "São Paulo, Brazil",
        "Cairo, Egypt",
        "Moscow, Russia",
        "Berlin, Germany",
        "Toronto, Canada",
        "Mexico City, Mexico",
        "Bangkok, Thailand",
        "Istanbul, Turkey",
        "Los Angeles, USA",
        "Shanghai, China",
        "Jakarta, Indonesia",
        "Delhi, India"
    ]
    
    private var timer: Timer?
    
    func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            self?.currentTime = Date()
        }
    }
    
    func addTimeZone(_ cityCountry: String) {
        // Implementation for adding time zones
    }
    
    func removeTimeZone(at index: Int) {
        // Implementation for removing time zones
    }
    
    func moveTimeZone(from source: IndexSet, to destination: Int) {
        // Implementation for reordering time zones
    }
}
```

### 2. City Selection and Search
```swift
struct CitySearchView: View {
    @StateObject private var viewModel = CitySearchViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                // Search Bar
                SearchBar(text: $viewModel.searchText)
                
                if !viewModel.searchText.isEmpty {
                    // Search Results
                    List(viewModel.filteredCities) { city in
                        CityRow(city: city)
                            .onTapGesture {
                                viewModel.selectCity(city)
                                dismiss()
                            }
                    }
                } else {
                    // Popular Cities Grid
                    ScrollView {
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))]) {
                            ForEach(viewModel.popularCities, id: \.self) { city in
                                PopularCityButton(city: city) {
                                    viewModel.selectCity(city)
                                    dismiss()
                                }
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Add City")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

class CitySearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var filteredCities: [City] = []
    
    func searchCities(_ query: String) {
        // Implementation for city search with timezone validation
    }
    
    func selectCity(_ city: String) {
        // Implementation for city selection
    }
}
```

### 3. Time Comparison Grid
```swift
struct TimeComparisonGrid: View {
    @StateObject private var viewModel = TimeComparisonViewModel()
    
    var body: some View {
        List {
            ForEach(viewModel.timeZones) { timeZone in
                TimeZoneRow(timeZone: timeZone)
                    .swipeActions(edge: .trailing) {
                        Button(role: .destructive) {
                            viewModel.removeTimeZone(timeZone)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
            }
            .onMove { source, destination in
                viewModel.moveTimeZone(from: source, to: destination)
            }
        }
        .toolbar {
            EditButton()
        }
    }
}

struct TimeZoneRow: View {
    let timeZone: TimeZoneInfo
    
    var body: some View {
        HStack {
            if timeZone.isHomeTimeZone {
                Image(systemName: "house.fill")
                    .foregroundColor(.accentColor)
            }
            
            Button(role: .destructive) {
                // Delete action
            } label: {
                Image(systemName: "xmark")
                    .foregroundColor(.gray)
                    .opacity(0.7)
            }
            .buttonStyle(.borderless)
            
            VStack(alignment: .leading) {
                Text(timeZone.cityName)
                    .font(.headline)
                Text(timeZone.countryName)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Text(formattedTime(for: timeZone))
                .font(.system(.title2, design: .rounded))
                .monospacedDigit()
        }
        .padding(.vertical, 8)
    }
}
```

### 4. Data Persistence
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
    
    func saveContext() {
        let context = container.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let error = error as NSError
                fatalError("Unresolved error \(error)")
            }
        }
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
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct WorldTimeWidgetView: View {
    let entry: TimeEntry
    
    var body: some View {
        VStack(spacing: 8) {
            ForEach(entry.timeZones) { timeZone in
                HStack {
                    Text(timeZone.cityName)
                        .font(.system(.body, design: .rounded))
                    Spacer()
                    Text(timeZone.formattedTime)
                        .font(.system(.body, design: .monospaced))
                }
            }
        }
        .padding()
    }
}
```

## App Flow & Navigation

### 1. Main Views
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

## Advanced Features

### 1. Live Activities
```swift
struct MeetingTimerAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var timeRemaining: Int
        var participantTimeZones: [String]
    }
    
    var meetingName: String
}
```

### 2. Shortcuts Integration
```swift
class ShortcutsManager {
    static let shared = ShortcutsManager()
    
    func donateAddCity(_ city: String) {
        let activity = NSUserActivity(activityType: "com.app.addCity")
        activity.title = "Add \(city)"
        activity.suggestedInvocationPhrase = "Add \(city) time"
        activity.isEligibleForPrediction = true
        
        let attributes = CSSearchableItemAttributeSet(itemType: "com.app.city")
        attributes.contentDescription = "Add \(city) to your time zones"
        activity.contentAttributeSet = attributes
        
        activity.becomeCurrent()
    }
}
```

## Testing Strategy
1. Unit Tests for ViewModels
2. UI Tests for critical paths
3. Integration tests for API calls
4. Performance testing
5. Localization testing
6. Widget testing
7. CoreData persistence testing

## Deployment Checklist
- [ ] App Store screenshots
- [ ] App privacy details
- [ ] Localization complete
- [ ] TestFlight testing
- [ ] Marketing page
- [ ] Support documentation
- [ ] Analytics implementation
- [ ] Crash reporting setup
- [ ] Widget configurations
- [ ] Live Activity testing
- [ ] iCloud sync verification
- [ ] In-App Purchase testing

## Future Enhancements
1. AR view for world clock
2. Travel planning integration
3. Business hours overlay
4. Meeting availability finder
5. Flight time integration
6. Weather radar view
7. Custom complications for Apple Watch
8. Mac Catalyst support
9. Interactive widgets (iOS 17+)
10. Focus filters integration

## Notes for Implementation
- Prioritize smooth animations and transitions
- Implement proper error handling and offline support
- Focus on accessibility features
- Optimize for battery life
- Cache weather data appropriately
- Use proper logging for debugging
- Implement proper rate limiting for API calls
- Ensure proper handling of background updates
- Implement efficient CoreData fetch requests
- Use appropriate threading for data operations

Remember to maintain a clean, modular architecture that allows for easy feature additions and maintenance. The UI should feel native to iOS while providing enhanced functionality compared to the web version.
