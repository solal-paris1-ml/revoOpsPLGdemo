import streamlit as st
import requests
import json
import time
import os

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3001")

# Predefined choices
PRODUCTS = ["Product One", "Product Two", "General"]
BUDGET_RANGES = [
    "< $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "> $10,000"
]

# Predefined event types
EVENT_TYPES = [
    "page_view",
    "tool_usage",
    "contact_form_submit",
    "nav_click",
    "learn_more_click",
    "contact_us_click",
    "back_to_home_click",
    "back_to_homepage_click",
    "chat_with_us_click",
    "custom"
]


def send_event(event_data):
    """Send an event to the backend"""
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/event",
            json=event_data
        )
        return response.status_code == 200, response.json()
    except Exception as e:
        return False, str(e)


def send_contact_message(contact_data):
    """Send a contact message to the backend"""
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/contact-message",
            json=contact_data
        )
        return response.status_code == 200, response.json()
    except Exception as e:
        return False, str(e)


def main():
    st.title("PLG Simulator")
    
    # Sidebar for configuration
    st.sidebar.header("Configuration")
    simulation_type = st.sidebar.radio(
        "Select Simulation Type",
        ["Event Tracking", "Contact Form"]
    )
    
    if simulation_type == "Event Tracking":
        st.header("Event Tracking Simulator")
        
        # Single event submission
        st.subheader("Single Event Submission")
        
        # Create a form for single event submission
        with st.form("single_event_form"):
            # Event type selection
            event_type = st.selectbox(
                "Event Type",
                EVENT_TYPES
            )
            
            # Tool name input
            tool_name = st.text_input("Tool Name (optional)")
            
            # Details input as JSON
            details_json = st.text_area(
                "Enter event details as JSON",
                value='{"key": "value"}',
                height=150
            )
            
            # Submit button for single event
            submitted = st.form_submit_button("Send Single Event")
            
            if submitted:
                try:
                    details = json.loads(details_json)
                    event_data = {
                        "type": event_type,
                        "toolName": tool_name if tool_name else None,
                        "details": details
                    }
                    
                    success, response = send_event(event_data)
                    if success:
                        st.success("Event sent successfully!")
                    else:
                        st.error(f"Failed to send event: {response}")
                except json.JSONDecodeError:
                    st.error("Invalid JSON format in details")
        
        # Batch event submission
        st.subheader("Batch Event Submission")
        st.markdown("""
        Example JSON format for batch event submission:
        ```json
        [
            {
                "type": "page_view",
                "toolName": "Product One",
                "details": {
                    "page": "home",
                    "timestamp": "2024-03-20T12:00:00Z"
                }
            },
            {
                "type": "tool_usage",
                "toolName": "Product Two",
                "details": {
                    "action": "click",
                    "element": "learn_more"
                }
            }
        ]
        ```
        """)
        
        batch_json = st.text_area(
            "Enter multiple events as JSON array",
            value='[{"type": "page_view", "toolName": "Product One", '
                  '"details": {"page": "home"}}]',
            height=150
        )
        
        if st.button("Send Batch Events"):
            try:
                events = json.loads(batch_json)
                if not isinstance(events, list):
                    st.error("Input must be a JSON array")
                    return
                
                success_count = 0
                for event in events:
                    # Validate event type
                    if "type" not in event:
                        st.warning(
                            "Missing 'type' in event. Skipping event."
                        )
                        continue
                    
                    if event["type"] not in EVENT_TYPES:
                        st.warning(
                            f"Invalid event type '{event['type']}'. "
                            "Using 'custom' instead."
                        )
                        event["type"] = "custom"
                    
                    success, response = send_event(event)
                    if success:
                        success_count += 1
                    time.sleep(0.5)  # Add delay between requests
                
                st.success(
                    f"Successfully sent {success_count} out of {len(events)} "
                    "events"
                )
            except json.JSONDecodeError:
                st.error("Invalid JSON format in batch data")
    
    else:  # Contact Form
        st.header("Contact Form Simulator")
        
        # Create a form for single contact submission
        with st.form("single_contact_form"):
            # Contact form fields
            col1, col2 = st.columns(2)
            
            with col1:
                name = st.text_input("Name")
                email = st.text_input("Email")
                company = st.text_input("Company")
                phone = st.text_input("Phone")
            
            with col2:
                product = st.selectbox("Product", PRODUCTS)
                budget = st.selectbox("Budget Range", [""] + BUDGET_RANGES)
                message = st.text_area("Message")
            
            # Submit button for single contact
            submitted = st.form_submit_button("Send Single Contact")
            
            if submitted:
                contact_data = {
                    "name": name,
                    "email": email,
                    "company": company,
                    "phone": phone,
                    "budget": budget,
                    "message": message,
                    "product": product
                }
                
                success, response = send_contact_message(contact_data)
                if success:
                    st.success("Contact form submitted successfully!")
                else:
                    st.error(f"Failed to submit contact form: {response}")
        
        # Batch simulation
        st.subheader("Batch Simulation")
        st.markdown("""
        Example JSON format for batch submission:
        ```json
        [
            {
                "name": "John Doe",
                "email": "john@example.com",
                "company": "Acme Inc",
                "phone": "+1234567890",
                "budget": "> $10,000",
                "message": "Interested in your product",
                "product": "Product One"
            }
        ]
        ```
        """)
        
        batch_json = st.text_area(
            "Enter multiple contact submissions as JSON array",
            value='[{"name": "John Doe", "email": "john@example.com", '
                  '"message": "Test message", "product": "Product One", '
                  '"budget": "> $10,000"}]',
            height=150
        )
        
        if st.button("Send Batch Contacts"):
            try:
                contacts = json.loads(batch_json)
                if not isinstance(contacts, list):
                    st.error("Input must be a JSON array")
                    return
                
                success_count = 0
                for contact in contacts:
                    # Validate product and budget
                    if "product" in contact and contact["product"] not in PRODUCTS:
                        st.warning(
                            f"Invalid product '{contact['product']}' in contact. "
                            "Using 'General' instead."
                        )
                        contact["product"] = "General"
                    
                    if "budget" in contact and contact["budget"] not in BUDGET_RANGES:
                        st.warning(
                            f"Invalid budget '{contact['budget']}' in contact. "
                            "Using empty budget instead."
                        )
                        contact["budget"] = ""
                    
                    success, response = send_contact_message(contact)
                    if success:
                        success_count += 1
                    time.sleep(0.5)  # Add delay between requests
                
                st.success(
                    f"Successfully sent {success_count} out of {len(contacts)} "
                    "contacts"
                )
            except json.JSONDecodeError:
                st.error("Invalid JSON format in batch data")


if __name__ == "__main__":
    main() 