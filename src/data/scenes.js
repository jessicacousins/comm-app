const P = (id, label, speak = label) => ({ id, label, speak });

export const SCENES = [
  { id: "medical", label: "Medical" },
  { id: "work", label: "Work" },
  { id: "transit", label: "Transit" },
  { id: "dining", label: "Dining" },
  { id: "social", label: "Social" },
];

export const SCENE_PHRASES = {
  medical: [
    P("med-need-nurse", "I need a nurse."),
    P("med-need-doctor", "I need to see a doctor."),
    P("med-pain-scale", "My pain is severe."),
    P("med-pain-location", "The pain is here."),
    P("med-no-consent", "I do not consent to that."),
    P("med-ask-explain", "Please explain the plan."),
    P("med-side-effects", "I think I have side effects."),
    P("med-allergy", "I have an allergy."),
    P("med-quiet", "I need a quieter room."),
    P("med-second-opinion", "I want a second opinion."),
    P("med-water", "I need water."),
    P("med-restroom", "I need the restroom."),
  ],
  work: [
    P("work-schedule", "Please confirm my schedule."),
    P("work-break", "I need a break."),
    P("work-remote", "I would like to work remotely."),
    P("work-accom", "I need accommodations."),
    P("work-feedback", "Please give me feedback."),
    P("work-training", "I need training for this task."),
    P("work-deadline", "What is the deadline?"),
    P("work-join-meeting", "Help me join the meeting."),
    P("work-quiet-space", "I need a quieter workspace."),
    P("work-task-finished", "This task is finished."),
    P("work-task-help", "I need help with this task."),
  ],
  transit: [
    P("tr-need-ride", "I need a ride now."),
    P("tr-eta", "What is the ETA?"),
    P("tr-where-pickup", "Where is pickup?"),
    P("tr-where-dropoff", "Where is drop-off?"),
    P("tr-slow", "Please slow down."),
    P("tr-stop", "Please stop the vehicle."),
    P("tr-route-change", "Please change the route."),
    P("tr-seatbelt", "Please help with my seatbelt."),
    P("tr-air-on", "Please turn the air on."),
    P("tr-air-off", "Please turn the air off."),
  ],
  dining: [
    P("dn-order", "I am ready to order."),
    P("dn-water", "Water please."),
    P("dn-no-ice", "No ice, please."),
    P("dn-allergy", "I have food allergies."),
    P("dn-soft", "I need soft texture."),
    P("dn-mild", "Please keep it mild."),
    P("dn-sauce-side", "Sauce on the side."),
    P("dn-check", "Please bring the check."),
    P("dn-thank", "Thank you for your help."),
  ],
  social: [
    P("sc-hello", "Hello."),
    P("sc-how-are-you", "How are you?"),
    P("sc-need-privacy", "I need privacy."),
    P("sc-change-topic", "Please change the topic."),
    P("sc-group", "I want to talk in a group."),
    P("sc-one-on-one", "I prefer one-on-one."),
    P("sc-slow", "Please speak slower."),
    P("sc-repeat", "Please repeat that."),
    P("sc-goodbye", "Goodbye."),
  ],
};

export function totalSceneCount() {
  return Object.values(SCENE_PHRASES).reduce((n, arr) => n + arr.length, 0);
}
