/**
 * AffidavitAssist — A MyLawSA Product

 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Modal, FlatList, Alert, Platform, StatusBar, Dimensions, Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// ─────────────────────────────────────────────────────────────────
// COMPANY LOGO (base64 embedded)
// ─────────────────────────────────────────────────────────────────
const LOGO_B64 = 'data:image/png;base64,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';

// ─────────────────────────────────────────────────────────────────
// COLOURS
// ─────────────────────────────────────────────────────────────────
const C = {
  red:         '#C62828',
  red2:        '#B71C1C',
  redLight:    '#FFEBEE',
  yellow:      '#F9A825',
  yellowLight: '#FFF8E1',
  yellow2:     '#F57F17',
  green:       '#2E7D32',
  greenLight:  '#E8F5E9',
  green2:      '#1B5E20',
  white:       '#FFFFFF',
  bg:          '#FAF9F7',
  border:      '#E0DDD8',
  grey:        '#6B7280',
  greyLight:   '#F3F2F0',
  text:        '#1A1A1A',
};

// ─────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────
const isValidCell = v => /^\d{10}$/.test((v || '').replace(/\s/g, ''));
const isValidID = v => {
  const s = (v || '').replace(/\s/g, '');
  if (!/^\d{13}$/.test(s)) return false;
  // SA ID Luhn check: starting from right-most digit before check digit,
  // every second digit is doubled. Standard Luhn on 13-digit SA ID number.
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let d = parseInt(s[i]);
    // Digits at even indices (0,2,4...) are taken as-is; odd indices doubled
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(s[12]);
};
const isNotFuture = v => { if (!v) return false; const d = new Date(v); d.setHours(0,0,0,0); const t = new Date(); t.setHours(0,0,0,0); return d <= t; };
const digitsOnly  = v => v.replace(/[^\d]/g, '');

// ─────────────────────────────────────────────────────────────────
// EMAILJS INTEGRATION
// ─────────────────────────────────────────────────────────────────
const EJS_SERVICE_ID  = 'service_pj9mktr';
const EJS_TEMPLATE_ID = 'template_vpq5mfu';
const EJS_PUBLIC_KEY  = 'lanbNCHhv0_kK7jTz';
const EJS_RECIPIENTS  = ['legal@mylawsa.co.za', 'itdev2@mylawsa.co.za', 'itdev3@mylawsa.co.za'];

/**
 * sendEmail — fires an EmailJS request for each recipient.
 * @param {object} params  — template variable map
 * @returns {Promise<boolean>} — true if all sent ok, false if any failed
 */
async function sendEmail(params) {
  const results = await Promise.allSettled(
    EJS_RECIPIENTS.map(to =>
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EJS_SERVICE_ID,
          template_id: EJS_TEMPLATE_ID,
          user_id:     EJS_PUBLIC_KEY,
          template_params: { ...params, to_email: to },
        }),
      }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r; })
    )
  );
  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.warn('EmailJS: some sends failed', failed.map(f => f.reason?.message));
  }
  return failed.length === 0;
}

/**
 * buildEmailParams — builds the template variable map from a draft.
 * @param {object} draft
 * @param {string} trigger  — 'completed' | 'noms_optin' | 'marketing_optin'
 */
function buildEmailParams(draft, trigger) {
  const typeInfo   = AFFIDAVIT_TYPE_MAP[draft.statementTypeId] || {};
  const now        = new Date();
  const dateStr    = `${now.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()]} ${now.getFullYear()}`;
  const timeStr    = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  // Pull client name + contact from either vehicle or generic answers
  const clientName = draft.driver?.fullName
    || draft.genericAnswers?.fullName
    || '[Unknown]';
  const clientCell = draft.driver?.cellOrEmail
    || draft.genericAnswers?.cell
    || '[Not provided]';
  const clientId   = draft.driver?.idNumber
    || draft.genericAnswers?.idNumber
    || '[Not provided]';

  const triggerLabels = {
    completed:       'Statement Completed',
    noms_optin:      'NOMS Recovery Opt-In',
    marketing_optin: 'Marketing Consent Opt-In',
  };

  // Truncate statement text to avoid email size limits (keep first 3000 chars)
  const stText = draft.statementText
    ? (draft.statementText.length > 3000
        ? draft.statementText.slice(0, 3000) + '\n\n[... statement truncated — full copy saved in app ...]'
        : draft.statementText)
    : '[Statement not yet generated]';

  return {
    trigger_type:    triggerLabels[trigger] || trigger,
    report_number:   draft.reportNumber || draft.id || '[Unknown]',
    statement_type:  typeInfo.label || draft.statementTypeId || 'Vehicle Accident',
    category:        typeInfo.categoryLabel || 'Vehicle / Road Accident',
    client_name:     clientName,
    client_cell:     clientCell,
    client_id:       clientId,
    date_submitted:  `${dateStr} at ${timeStr}`,
    statement_text:  stText,
    noms_consent:    draft.consentMyLawSA  ? 'YES — opted in' : 'No',
    marketing_consent: draft.consentMarketing ? 'YES — opted in' : 'No',
  };
}



// ─────────────────────────────────────────────────────────────────
// AFFIDAVIT CATEGORIES & TYPES
// ─────────────────────────────────────────────────────────────────
const AFFIDAVIT_CATEGORIES = [
  {
    id: 'vehicle',
    icon: '🚗',
    label: 'Vehicle / Road Accident',
    colour: '#C62828',
    description: 'Motor vehicle accidents, collision damage, hit and run, road incident statements.',
    isDefault: true,
    types: [
      { id: 'vehicle_accident', label: 'Road Accident Statement', description: 'Guided step-by-step accident statement for SAPS / insurance purposes.' },
    ],
  },
  {
    id: 'crime',
    icon: '🚓',
    label: 'Crime-Related',
    colour: '#1565C0',
    description: 'Theft, burglary, assault, fraud, identity theft, and damage to property.',
    types: [
      { id: 'crime_theft_personal',   label: 'Theft (Personal Items)',         description: 'Cellphone, wallet, laptop, or other personal belongings stolen.' },
      { id: 'crime_theft_vehicle',    label: 'Theft from / of a Vehicle',      description: 'Items stolen from your vehicle, or your vehicle stolen / attempted theft.' },
      { id: 'crime_theft_docs',       label: 'Theft of Identity Documents',    description: "ID book, smart ID, passport, or driver's licence stolen." },
      { id: 'crime_burglary_res',     label: 'Residential Burglary',           description: 'Break-in or burglary at your home or residence.' },
      { id: 'crime_burglary_biz',     label: 'Business Premises Burglary',     description: 'Break-in or burglary at a business or commercial property.' },
      { id: 'crime_burglary_attempt', label: 'Attempted Burglary',             description: 'Attempted break-in where no entry was successfully gained.' },
      { id: 'crime_assault',          label: 'Physical Assault',               description: 'Physical attack or assault with or without a weapon.' },
      { id: 'crime_assault_gbh',      label: 'Assault with Intent (GBH)',      description: 'Assault with intent to cause grievous bodily harm.' },
      { id: 'crime_threats',          label: 'Threats or Intimidation',        description: 'Verbal or written threats or intimidation by another person.' },
      { id: 'crime_fraud_accounts',   label: 'Fraudulent Accounts in My Name', description: 'Accounts or contracts opened in your name without your consent.' },
      { id: 'crime_fraud_financial',  label: 'Financial / Credit Fraud',       description: 'Unauthorized financial transactions or credit fraud.' },
      { id: 'crime_fraud_docs',       label: 'Forged or Falsified Documents',  description: 'Documents forged, falsified, or fraudulently used in your name.' },
      { id: 'crime_fraud_info',       label: 'Personal Information Misuse',    description: 'Your personal information used without your knowledge or consent.' },
      { id: 'crime_damage_malicious', label: 'Malicious Damage to Property',   description: 'Intentional or malicious damage to your property.' },
      { id: 'crime_damage_vandalism', label: 'Vandalism',                      description: 'Graffiti, defacement, or vandalism of your property.' },
    ],
  },
  {
    id: 'documents',
    icon: '📄',
    label: 'Lost Documents',
    colour: '#E65100',
    description: "Lost ID, passport, driver's licence, bank cards, and official documents.",
    types: [
      { id: 'doc_lost_id',        label: 'Lost ID Book / Smart ID',                description: 'South African ID book or smart ID card lost or misplaced.' },
      { id: 'doc_lost_passport',  label: 'Lost Passport',                          description: 'South African or foreign passport lost or misplaced.' },
      { id: 'doc_lost_licence',   label: "Lost Driver's Licence",                 description: "Driver's licence card lost or misplaced." },
      { id: 'doc_lost_bankcard',  label: 'Lost Bank Card / Credit Card',           description: 'Bank, credit, or debit card lost or misplaced.' },
      { id: 'doc_lost_access',    label: 'Lost Work / Access Card',                description: 'Workplace access card, security card, or access pass lost.' },
      { id: 'doc_lost_vehicle',   label: 'Lost Vehicle / Licensing Documents',     description: 'Vehicle registration papers or licensing documents lost.' },
    ],
  },
  {
    id: 'financial',
    icon: '🏦',
    label: 'Financial / Civil',
    colour: '#2E7D32',
    description: 'Property loss, income verification, employment changes, insurance claims.',
    types: [
      { id: 'fin_property_loss',  label: 'Loss of Property',                       description: 'Property lost due to fire, natural disaster, or accident.' },
      { id: 'fin_income_verify',  label: 'Income / Residence Verification',        description: 'Proof of income or residence for banks or financial institutions.' },
      { id: 'fin_employment',     label: 'Employment Change / Suspension',         description: 'Explanation of job suspension, dismissal, or employment change.' },
      { id: 'fin_insurance',      label: 'Insurance-Related Statement',            description: 'Damage descriptions, loss claims, or insurance-related declarations.' },
    ],
  },
  {
    id: 'personal',
    icon: '👥',
    label: 'Personal Statements',
    colour: '#6A1B9A',
    description: 'Proof of address, residency, guardianship, household circumstances.',
    types: [
      { id: 'pers_address',       label: 'Proof of Address',                       description: 'Confirming your residential address for official purposes.' },
      { id: 'pers_residency',     label: 'Proof of Residency Status',              description: 'For students, tenants, or visitors confirming residency status.' },
      { id: 'pers_incident',      label: 'General Incident Description',           description: 'Description of an incident where no formal documentation exists.' },
      { id: 'pers_guardianship',  label: 'Guardianship / Responsibility for Minor',description: 'Confirming guardianship or parental responsibility for a minor.' },
      { id: 'pers_household',     label: 'Household Circumstances',                description: 'Statement regarding household circumstances for official purposes.' },
    ],
  },
  {
    id: 'legal',
    icon: '🛂',
    label: 'Legal & Administrative',
    colour: '#37474F',
    description: 'Court witness statements, SARS, Department of Labour, lost court documents.',
    types: [
      { id: 'legal_witness',      label: 'Witness Statement (Court / Police)',     description: 'Formal witness statement for court or police proceedings.' },
      { id: 'legal_court_docs',   label: 'Lost Court Documents',                  description: 'Statement regarding lost or missing court documents.' },
      { id: 'legal_sars',         label: 'SARS-Related Statement',                description: 'Lost IRP5, unknown deposits, or SARS-related declarations.' },
      { id: 'legal_labour',       label: 'Department of Labour Statement',        description: 'Lost employment records or Department of Labour declarations.' },
    ],
  },
  {
    id: 'other',
    icon: '📦',
    label: 'Other Common Statements',
    colour: '#4E342E',
    description: 'Lost parcels, suspicious activity, workplace accidents, animal incidents.',
    types: [
      { id: 'other_parcel',       label: 'Lost Parcel / Transported Item',         description: 'Statement regarding a lost or damaged parcel or shipped item.' },
      { id: 'other_suspicious',   label: 'Suspicious Activity Report',             description: 'Reporting suspicious activity at a residence or business.' },
      { id: 'other_workplace',    label: 'Workplace Accident / Incident',          description: 'Statement regarding an accident or incident at the workplace.' },
      { id: 'other_animal',       label: 'Animal-Related Incident',                description: 'Animal bite, attack, or damage caused by an animal.' },
    ],
  },
];

// Flat lookup by type id
const AFFIDAVIT_TYPE_MAP = {};
AFFIDAVIT_CATEGORIES.forEach(cat => {
  cat.types.forEach(t => { AFFIDAVIT_TYPE_MAP[t.id] = { ...t, categoryId: cat.id, categoryLabel: cat.label, categoryColour: cat.colour, categoryIcon: cat.icon }; });
});

// ─────────────────────────────────────────────────────────────────
// CLASSIFIER DATA
// ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id:1,  text:'Was there contact with a fixed object?',                                                  hint:'e.g. wall, pole, tree, parked vehicle, or barrier',  yes:'FIXED_OBJECT',    no:2  },
  { id:2,  text:'Did your vehicle strike the other vehicle from behind?',                                  hint:null,                                                  yes:'REAR_END',        no:3  },
  { id:3,  text:'Did the other vehicle strike you from behind?',                                           hint:null,                                                  yes:'REAR_END',        no:4  },
  { id:4,  text:'Did the vehicles collide front-to-front (head-on)?',                                     hint:'Direct frontal impact — both front ends damaged',     yes:'HEAD_ON',         no:5  },
  { id:5,  text:'Did the collision occur at an intersection?',                                             hint:'With or without traffic lights',                      yes:6,                 no:9  },
  { id:6,  text:'Did one vehicle strike the other on the SIDE?',                                          hint:'e.g. T-bone; impact to door area',                    yes:'SIDE_IMPACT',     no:7  },
  { id:7,  text:'Did the collision occur while one vehicle was turning (left or right)?',                  hint:null,                                                  yes:'TURNING',         no:8  },
  { id:8,  text:'Did the vehicles lightly scrape or swipe each other at the intersection?',               hint:null,                                                  yes:'SIDE_SWIPE',      no:9  },
  { id:9,  text:'Did you or the other vehicle change lanes shortly before impact?',                        hint:null,                                                  yes:'LANE_CHANGE',     no:10 },
  { id:10, text:'Did the vehicles make light side-to-side contact while travelling in the same direction?',hint:'Parallel movement',                                   yes:'SIDE_SWIPE',      no:11 },
  { id:11, text:'Was the other vehicle moving inside a parking area or parking-lot lanes?',               hint:'Low speed between bays',                              yes:'PARKING',         no:12 },
  { id:12, text:'Were more than two vehicles involved?',                                                  hint:null,                                                  yes:'MULTI_VEHICLE',   no:13 },
  { id:13, text:'Did the other driver flee the scene?',                                                   hint:null,                                                  yes:'HIT_AND_RUN',     no:14 },
  { id:14, text:'Was this a single-vehicle incident (no other vehicle was struck)?',                      hint:'Skidded, rolled, hit an object, left roadway',        yes:'SINGLE_VEHICLE',  no:15 },
  { id:15, text:'Was a pedestrian, cyclist, or motorcyclist involved?',                                   hint:null,                                                  yes:'PEDESTRIAN',      no:'NOT_CLASSIFIABLE' },
];

const OUTCOMES = {
  FIXED_OBJECT:     { label:'Fixed Object Collision',                            claimable:false, icon:'⚠️', subQs:[
    { id:'fq_object',    label:'Object struck',                              type:'text',  placeholder:'Describe the object that was struck' },
    { id:'fq_road_cond', label:'Did you lose control due to road conditions?',type:'ynu'                                                     },
    { id:'fq_road_desc', label:'If Yes — describe conditions',               type:'text',  placeholder:'e.g. wet road, pothole',    conditionalOn:'fq_road_cond'  },
    { id:'fq_avoiding',  label:'Were you avoiding another road user?',        type:'ynu'                                                     },
    { id:'fq_mech',      label:'Was mechanical failure suspected?',           type:'ynu'                                                     },
    { id:'fq_parked',    label:'Was a parked vehicle struck?',                type:'ynu'                                                     },
    { id:'fq_damage',    label:'Was there property damage beyond your vehicle?',type:'ynu'                                                   },
  ]},
  REAR_END:         { label:'Rear-end Collision',                               claimable:true,  icon:'⚖️', subQs:[
    { id:'rq_front',     label:'Were you the front vehicle?',                 type:'ynu'  },
    { id:'rq_stationary',label:'Were you stationary at time of impact?',      type:'ynu'  },
    { id:'rq_slowing',   label:'Were you slowing down?',                      type:'ynu'  },
    { id:'rq_braked',    label:'Did you brake before impact?',                type:'ynu'  },
    { id:'rq_reason',    label:'Was there a clear reason for slowing/stopping?',type:'ynu'},
    { id:'rq_reason_d',  label:'If Yes — describe reason',                    type:'text', placeholder:'e.g. traffic light, jam', conditionalOn:'rq_reason' },
    { id:'rq_you_lane',  label:'Did YOU change lanes just before impact?',    type:'ynu'  },
    { id:'rq_other_lane',label:'Did the OTHER vehicle change lanes?',         type:'ynu'  },
    { id:'rq_follow',    label:'Estimate following distance',                  type:'text', placeholder:'e.g. 2 car lengths / 5 metres' },
  ]},
  HEAD_ON:          { label:'Head-on Collision',                                claimable:true,  icon:'⚖️', subQs:[
    { id:'hq_correct',   label:'Were you in the correct lane?',               type:'ynu'  },
    { id:'hq_entered',   label:'Did the other vehicle enter your lane?',      type:'ynu'  },
    { id:'hq_overtaking',label:'Was overtaking involved?',                    type:'ynu'  },
    { id:'hq_markings',  label:'Were road markings visible?',                 type:'ynu'  },
    { id:'hq_braked',    label:'Did you brake before impact?',                type:'ynu'  },
    { id:'hq_swerved',   label:'Did you swerve to avoid the collision?',      type:'ynu'  },
    { id:'hq_swerve_d',  label:'If Yes — in which direction?',               type:'text', placeholder:'e.g. Left', conditionalOn:'hq_swerved' },
    { id:'hq_daylight',  label:'Was it daylight at the time?',                type:'ynu'  },
    { id:'hq_wet',       label:'Was the road wet or slippery?',               type:'ynu'  },
  ]},
  SIDE_IMPACT:      { label:'Side-impact / T-bone Collision',                   claimable:true,  icon:'⚖️', subQs:[
    { id:'sq_lights',    label:'Were traffic lights present?',                type:'ynu'  },
    { id:'sq_green',     label:'Did you have a green light?',                 type:'ynu'  },
    { id:'sq_stop',      label:'Were there stop signs present?',              type:'ynu'  },
    { id:'sq_stopped',   label:'Did you stop at the stop sign?',              type:'ynu'  },
    { id:'sq_straight',  label:'Were you driving straight?',                  type:'ynu'  },
    { id:'sq_side_hit',  label:'Which side of your vehicle was hit?',         type:'text', placeholder:'Left / Right' },
    { id:'sq_from_left', label:'Did the other vehicle come from the LEFT?',   type:'ynu'  },
    { id:'sq_from_right',label:'Did the other vehicle come from the RIGHT?',  type:'ynu'  },
    { id:'sq_direction', label:'Your direction of travel',                    type:'text', placeholder:'e.g. North on Main Street' },
  ]},
  TURNING:          { label:'Turning / Intersection-turn Collision',            claimable:true,  icon:'⚖️', subQs:[
    { id:'tq_you_turn',  label:'Were you the one turning?',                   type:'ynu'  },
    { id:'tq_left',      label:'Were you turning LEFT?',                      type:'ynu'  },
    { id:'tq_right',     label:'Were you turning RIGHT?',                     type:'ynu'  },
    { id:'tq_intersect', label:'Did the turn occur at an intersection?',      type:'ynu'  },
    { id:'tq_stationary',label:'Were you stationary before turning?',         type:'ynu'  },
    { id:'tq_control',   label:'Was traffic control present?',                type:'ynu'  },
    { id:'tq_ctrl_type', label:'If Yes — type of control',                   type:'text', placeholder:'traffic lights, stop, yield', conditionalOn:'tq_control' },
    { id:'tq_oncoming',  label:'Was the other vehicle oncoming?',             type:'ynu'  },
    { id:'tq_impact_pt', label:'Where in the turn did impact occur?',         type:'text', placeholder:'Start / Middle / End of turn' },
  ]},
  SIDE_SWIPE:       { label:'Side-swipe Collision',                            claimable:true,  icon:'⚖️', subQs:[
    { id:'ssq_same_dir', label:'Were both vehicles travelling in the same direction?',type:'ynu' },
    { id:'ssq_moving',   label:'Were both vehicles moving at time of contact?',      type:'ynu' },
    { id:'ssq_light',    label:'Was it a light scraping / glancing contact?',         type:'ynu' },
    { id:'ssq_you_chg',  label:'Did YOU change lanes shortly before impact?',         type:'ynu' },
    { id:'ssq_oth_chg',  label:'Did the OTHER vehicle change lanes?',                 type:'ynu' },
    { id:'ssq_indicator',label:'Did you use your indicator?',                         type:'ynu' },
    { id:'ssq_contact',  label:'Where did contact begin on your vehicle?',            type:'text', placeholder:'e.g. Front left door / Rear quarter panel' },
  ]},
  LANE_CHANGE:      { label:'Lane-change Collision',                           claimable:true,  icon:'⚖️', subQs:[
    { id:'lq_you',       label:'Did YOU change lanes?',                       type:'ynu'  },
    { id:'lq_other',     label:'Did the OTHER vehicle change lanes?',         type:'ynu'  },
    { id:'lq_indicator', label:'Did you use your indicator?',                 type:'ynu'  },
    { id:'lq_blind',     label:'Was there a blind spot issue?',               type:'ynu'  },
    { id:'lq_lanes',     label:'From lane → to lane',                        type:'text', placeholder:'e.g. Lane 1 to Lane 2' },
    { id:'lq_impact',    label:'Where on your vehicle did impact occur?',     type:'text', placeholder:'e.g. Rear left quarter panel' },
  ]},
  PARKING:          { label:'Parking-area Collision',                          claimable:true,  icon:'⚖️', subQs:[
    { id:'pq_you_rev',   label:'Were YOU reversing?',                         type:'ynu'  },
    { id:'pq_oth_rev',   label:'Was the OTHER vehicle reversing?',            type:'ynu'  },
    { id:'pq_pull_in',   label:'Were you pulling into a parking bay?',        type:'ynu'  },
    { id:'pq_pull_out',  label:'Were you pulling out of a parking bay?',      type:'ynu'  },
    { id:'pq_obstructed',label:'Was visibility obstructed?',                  type:'ynu'  },
    { id:'pq_obs_desc',  label:'If Yes — what caused the obstruction?',      type:'text', placeholder:'e.g. large vehicle, pillar', conditionalOn:'pq_obstructed' },
    { id:'pq_area_name', label:'Parking area name',                           type:'text', placeholder:'e.g. Eastgate Mall / Office Park' },
  ]},
  MULTI_VEHICLE:    { label:'Multi-vehicle / Chain Collision',                  claimable:true,  icon:'⚖️', subQs:[
    { id:'mq_struck',    label:'Were you struck first?',                      type:'ynu'  },
    { id:'mq_pushed',    label:'Were you pushed into another vehicle?',       type:'ynu'  },
    { id:'mq_stationary',label:'Were you stationary before secondary impacts?',type:'ynu' },
    { id:'mq_highway',   label:'Did the collision occur on a highway/freeway?',type:'ynu' },
    { id:'mq_count',     label:'Estimated number of vehicles involved',       type:'text', placeholder:'e.g. 3 vehicles' },
    { id:'mq_sequence',  label:'Describe the sequence of impacts',            type:'textarea', placeholder:'e.g. Vehicle A struck me, I was pushed into Vehicle B' },
  ]},
  HIT_AND_RUN:      { label:'Hit and Run',                                     claimable:true,  icon:'⚖️', subQs:[
    { id:'hrq_fled',     label:'Did the other driver leave without stopping?', type:'ynu' },
    { id:'hrq_details',  label:'Were any identifying details obtained?',       type:'ynu' },
    { id:'hrq_det_desc', label:'If Yes — colour, registration, description',  type:'text', placeholder:'e.g. White Toyota, GP 123-456', conditionalOn:'hrq_details' },
    { id:'hrq_direction',label:'Direction the vehicle fled',                   type:'text', placeholder:'e.g. Northbound on Commissioner Street' },
    { id:'hrq_witnesses',label:'Were there any witnesses?',                    type:'ynu' },
    { id:'hrq_cctv',     label:'Is CCTV footage possibly available nearby?',  type:'ynu' },
    { id:'hrq_reported', label:'Was the incident reported immediately to SAPS?',type:'ynu'},
  ]},
  SINGLE_VEHICLE:   { label:'Single-vehicle Collision',                         claimable:false, icon:'⚠️', subQs:[
    { id:'svq_left_road',label:'Did the vehicle leave the roadway?',           type:'ynu' },
    { id:'svq_rolled',   label:'Did the vehicle roll over?',                   type:'ynu' },
    { id:'svq_struck',   label:'Did the vehicle strike an object after leaving the roadway?', type:'ynu' },
    { id:'svq_obj_desc', label:'If Yes — what object was struck?',            type:'text', placeholder:'e.g. tree, barrier', conditionalOn:'svq_struck' },
    { id:'svq_road_cond',label:'Were road conditions a contributing factor?',  type:'ynu' },
    { id:'svq_rest_pos', label:'Final resting position of the vehicle',        type:'text', placeholder:'Describe where the vehicle came to rest' },
  ]},
  PEDESTRIAN:       { label:'Collision with Pedestrian / Cyclist / Motorcyclist', claimable:true, icon:'⚖️', subQs:[
    { id:'peq_user',     label:'Which road user was involved?',               type:'text', placeholder:'Pedestrian / Cyclist / Motorcyclist' },
    { id:'peq_crossing', label:'Did it occur at a marked pedestrian crossing?',type:'ynu' },
    { id:'peq_vis',      label:'Was visibility limited at the time?',          type:'ynu' },
    { id:'peq_vis_desc', label:'If Yes — reason',                             type:'text', placeholder:'e.g. heavy rain, dark conditions', conditionalOn:'peq_vis' },
    { id:'peq_braked',   label:'Did you brake before impact?',                type:'ynu' },
    { id:'peq_moved',    label:'Did the person move into your path?',          type:'ynu' },
    { id:'peq_injuries', label:'Were injuries visible?',                       type:'ynu' },
    { id:'peq_inj_desc', label:'If Yes — describe visible injuries',          type:'text', placeholder:'e.g. leg injury, abrasions', conditionalOn:'peq_injuries' },
    { id:'peq_dir',      label:'Direction of travel of the road user',         type:'text', placeholder:'e.g. Crossing from right to left' },
  ]},
  NOT_CLASSIFIABLE: { label:'Not Classifiable', claimable:false, icon:'⚠️', subQs:[] },
};

const PROVINCES    = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'];
const RELATIONSHIPS = ['Owner','Renter','Employee','Borrowed','Other'];
const MONTHS       = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────
const STORE_KEY = 'saps_v3';
async function loadDrafts()          { try { const r = await AsyncStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
async function saveDraft(d)          { try { const list = await loadDrafts(); const i = list.findIndex(x => x.id === d.id); if (i >= 0) list[i] = d; else list.unshift(d); await AsyncStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {} }
async function deleteDraft(id)       { try { const list = await loadDrafts(); await AsyncStorage.setItem(STORE_KEY, JSON.stringify(list.filter(x => x.id !== id))); } catch {} }

function createDraft(statementTypeId) {
  const now  = new Date();
  const id   = `${now.getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
  return {
    id, reportNumber:id, createdAt:now.toISOString(), status:'In Progress',
    statementTypeId: statementTypeId || 'vehicle_accident',
    driver:   { fullName:'', cellOrEmail:'', idNumber:'', address:'', licenceNumber:'', relationship:'' },
    vehicle:  { registration:'', make:'', model:'', year:'', colour:'', trailerInvolved:false, trailerReg:'' },
    accident: { date:'', time:'', street:'', landmark:'', city:'', province:'', caseNumber:'', estimatedDamage:'' },
    classifierAnswers:{}, accidentKey:null, subAnswers:{},
    otherParties:[], witnesses:[], statementText:'',
    genericAnswers:{},
    consentMarketing:false, consentMyLawSA:false,
  };
}

// ─────────────────────────────────────────────────────────────────
// STATEMENT BUILDER
// ─────────────────────────────────────────────────────────────────
const ph = (v, fb) => (v && String(v).trim()) ? String(v).trim() : `[${fb}]`;

function buildCircumstances(key, accident, sub, parties) {
  const street = ph(accident.street, 'STREET / ROAD');
  const o      = parties?.[0] ?? {};
  const oName  = ph(o.name,         'OTHER DRIVER NAME');
  const oReg   = ph(o.registration, 'OTHER REG');
  const oMake  = ph(o.make,         'OTHER MAKE');
  const oModel = ph(o.model,        'OTHER MODEL');
  const dir    = '[direction of travel]';

  switch (key) {
    case 'FIXED_OBJECT': {
      const obj = ph(sub.fq_object, 'OBJECT STRUCK');
      let p = `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. My vehicle made contact with ${obj}, which was situated adjacent to or on the roadway.\n\nAt the time of the incident, the fixed object was stationary and the impact was not as a result of a collision with another moving vehicle.`;
      if (sub.fq_road_cond === 'y' && sub.fq_road_desc) p += `\n\nThe road conditions at the time were ${sub.fq_road_desc.trim()}, which contributed to my loss of vehicle control.`;
      if (sub.fq_avoiding  === 'y') p += `\n\nI was executing an avoidance manoeuvre to prevent a collision with another road user, which caused my vehicle to come into contact with the fixed object.`;
      if (sub.fq_mech      === 'y') p += `\n\nI suspected a mechanical failure in my vehicle at the time of the incident.`;
      return p + `\n\nAs a result of the impact, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'REAR_END': {
      const dist = sub.rq_follow?.trim() || '[following distance]';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. I was travelling behind the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\nThe vehicle ahead slowed and/or stopped. My vehicle made contact with the rear of the said vehicle. The estimated following distance at the time was ${dist}.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'HEAD_ON':
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}, within my correct lane of travel. The vehicle driven by ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, was travelling in the opposite direction and crossed into my lane of travel, resulting in a frontal collision.\n\nI applied my brakes upon observing the oncoming vehicle in my lane but was unable to avoid the collision. The collision was caused by the other driver's failure to remain within their designated lane of travel.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    case 'SIDE_IMPACT': {
      const tc = sub.sq_lights === 'y' ? `There were traffic lights at the intersection${sub.sq_green === 'y' ? ' and I had a green light' : ''}. ` : '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} and entered the intersection in the normal course of travel. ${tc}The vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, approached from the side and collided with my vehicle at the intersection.\n\nThe collision was caused by the failure of the other driver to observe the applicable traffic control devices and/or to yield the right of way to my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'TURNING': {
      const td = sub.tq_left === 'y' ? 'left' : sub.tq_right === 'y' ? 'right' : '';
      return `On the date and at the time stated above, I was in the process of executing a ${td ? td + '-turn' : 'turning'} manoeuvre on ${street}. During the turning manoeuvre, the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, collided with my vehicle.\n\nThe collision was caused by the failure of the other driver to exercise due care and to yield the right of way.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'SIDE_SWIPE':
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}, within my designated lane of travel. The vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}, was travelling in an adjacent lane in the same direction and moved laterally towards my lane, making scraping contact with my vehicle.\n\nThe collision was caused by the other driver's failure to ensure sufficient clearance before changing lanes.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    case 'LANE_CHANGE': {
      const lanes = sub.lq_lanes?.trim() || '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street}. A lane-change collision occurred involving my vehicle and the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\n${lanes ? `The lane change was from ${lanes}. ` : ''}The other vehicle executed a lane change without ensuring that the lane was clear, making contact with my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'PARKING': {
      const area = sub.pq_area_name?.trim() || '';
      return `On the date and at the time stated above, I was driving within a parking area${area ? ` (${area})` : ''} when a collision occurred involving my vehicle and the vehicle of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}. Both vehicles were manoeuvring within the parking area at very low speed.\n\nThe collision was caused by the other driver's failure to keep a proper lookout and to yield to my vehicle.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'MULTI_VEHICLE': {
      const count = sub.mq_count?.trim()    || '[number of vehicles]';
      const seq   = sub.mq_sequence?.trim() || '[sequence of impacts]';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a multi-vehicle collision occurred involving ${count}.\n\n${seq}\n\nThe initial impact was caused by the negligence of ${oName}, registration number ${oReg}, a ${oMake} ${oModel}.\n\nAs a result of the collision, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'HIT_AND_RUN': {
      const fled    = sub.hrq_direction?.trim() || '[direction]';
      const details = sub.hrq_det_desc ? `\n\nI was able to note the following identifying details of the fleeing vehicle: ${sub.hrq_det_desc.trim()}.` : '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when an unknown vehicle collided with my vehicle. Following the collision, the driver of the other vehicle failed to stop as required by law and fled the scene in a ${fled} direction.${details}\n\nThe incident was reported to the South African Police Service. The damage sustained to my vehicle was caused directly by the collision with the fleeing vehicle.`;
    }
    case 'SINGLE_VEHICLE': {
      const rest = sub.svq_rest_pos?.trim() || '';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a single-vehicle incident occurred involving only my vehicle. No other vehicle was involved in the incident.\n\n${rest ? `My vehicle came to rest at ${rest}. ` : ''}The circumstances of the incident are as captured in the classification section of this statement.\n\nAs a result of the incident, my vehicle sustained the damage described in the damage section of this statement.`;
    }
    case 'PEDESTRIAN': {
      const user = sub.peq_user?.trim() || 'pedestrian / cyclist / motorcyclist';
      return `On the date and at the time stated above, I was travelling in a ${dir} direction along ${street} when a collision occurred involving my vehicle and a ${user}.\n\nThe circumstances of the collision are as captured in the classification section of this statement. My vehicle sustained damage as a result of the collision.`;
    }
    default:
      return `On the date and at the time stated above, I was travelling along ${street} when a road traffic incident occurred.\n\n[PLEASE DESCRIBE THE CIRCUMSTANCES OF THE ACCIDENT IN YOUR OWN WORDS — this accident type could not be automatically classified]\n\nThe other vehicle involved was driven by ${oName}, registration number ${oReg}. As a result of the incident, my vehicle sustained damage.`;
  }
}

function buildStatement(draft) {
  const { driver, vehicle, accident, accidentKey, subAnswers, otherParties, witnesses } = draft;
  const sub  = subAnswers   || {};
  const pars = otherParties || [];
  const wits = witnesses    || [];
  const o    = pars[0]      || {};
  const line = '─'.repeat(40);

  const dateStr = accident.date
    ? (() => { const d = new Date(accident.date); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
    : '[DATE]';

  let s = `SAPS ACCIDENT STATEMENT\n${line}\n`;
  if (accident.estimatedDamage?.trim()) s += `Estimated Vehicle Damage: R ${accident.estimatedDamage.trim()}\n`;
  if (accident.caseNumber?.trim()) s += `SAPS Case Number: ${accident.caseNumber.trim()}\n`;

  s += `\nI, ${ph(driver.fullName,'FULL NAME')}, ID / Passport No. ${ph(driver.idNumber,'ID / PASSPORT NUMBER')}, residing at ${driver.address?.trim() || '[RESIDENTIAL ADDRESS]'}, hereby declare the following:\n`;
  s += `\n${line}\n1. MY VEHICLE\n${line}\n`;
  s += `I am the ${driver.relationship || 'owner'} of a ${ph(vehicle.colour,'COLOUR')} ${ph(vehicle.year,'YEAR')} ${ph(vehicle.make,'MAKE')} ${ph(vehicle.model,'MODEL')}, registration number ${ph(vehicle.registration,'REGISTRATION')}.\n`;
  if (vehicle.trailerInvolved && vehicle.trailerReg) s += `A trailer with registration number ${vehicle.trailerReg} was also attached to my vehicle.\n`;

  s += `\n${line}\n2. THE ACCIDENT\n${line}\n`;
  s += `On ${dateStr} at approximately ${accident.time || '[TIME]'}, I was involved in a road traffic accident on ${ph(accident.street,'STREET / ROAD')}${accident.landmark?.trim() ? `, near ${accident.landmark.trim()}` : ''}, in ${ph(accident.city,'CITY')}, ${accident.province || '[PROVINCE]'}.\n`;

  s += `\n${line}\n3. CIRCUMSTANCES\n${line}\n`;
  s += buildCircumstances(accidentKey, accident, sub, pars) + '\n';

  s += `\n${line}\n4. OTHER PARTY\n${line}\n`;
  if (pars.length > 0) {
    pars.forEach((p, i) => {
      s += `${i > 0 ? '\n' : ''}The ${i === 0 ? 'other' : `additional (${i+1})`} vehicle involved was a ${ph(p.make,'MAKE')} ${ph(p.model,'MODEL')}, registration number ${ph(p.registration,'REG')}, driven by ${ph(p.name,'DRIVER NAME')}.\n`;
    });
  } else {
    s += `The other vehicle involved was a ${ph(o.make,'OTHER MAKE')} ${ph(o.model,'OTHER MODEL')}, registration number ${ph(o.registration,'OTHER REG')}, driven by ${ph(o.name,'OTHER DRIVER NAME')}.\n`;
  }
  if (wits.length > 0) { s += `\nWitness(es):\n`; wits.forEach((w,i) => { s += `${i+1}. ${ph(w.name,'WITNESS NAME')}${w.contact ? ` — ${w.contact}` : ''}\n`; }); }

  s += `\n${line}\n5. DAMAGES\n${line}\n`;
  s += `My vehicle sustained damage as a result of the collision.\n`;

  s += `\n${line}\n6. DECLARATION\n${line}\n`;
  s += `I declare that the contents of this statement are true and correct to the best of my knowledge and belief.\n`;
  s += `\n\nSignature: _________________________\n\nDate: _____________________________\n`;
  return s;
}

// ─────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────

function TopBar({ title, subtitle, onBack }) {
  return (
    <View style={ui.topBar}>
      <View style={ui.topBarRow}>
        {onBack && (
          <TouchableOpacity style={ui.backBtn} onPress={onBack} activeOpacity={0.75}>
            <Text style={ui.backBtnTxt}>‹</Text>
          </TouchableOpacity>
        )}
        <Image source={{ uri: LOGO_B64 }} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={ui.barTitle}>{title}</Text>
          {subtitle ? <Text style={ui.barSub}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

function ProgressBar({ step, total, label }) {
  return (
    <View style={ui.progressWrap}>
      <View style={ui.progressTrack}>
        <View style={[ui.progressFill, { width: `${Math.min(100, (step / total) * 100)}%` }]} />
      </View>
      {label ? <Text style={ui.progressLbl}>{label}</Text> : null}
    </View>
  );
}

function FieldLabel({ children, required }) {
  return <Text style={ui.fieldLbl}>{children}{required ? <Text style={{ color: C.yellow }}> *</Text> : null}</Text>;
}

function Field({ label, required, children, style }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </View>
  );
}

function Inp({ value, onChangeText, placeholder, multiline, numberOfLines, keyboardType, editable, style, error }) {
  return (
    <>
      <TextInput
        style={[ui.inp, multiline && { minHeight: 88, textAlignVertical: 'top' }, error && { borderColor: C.red, borderWidth: 2 }, style]}
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor="#bbb" keyboardType={keyboardType}
        multiline={multiline} numberOfLines={numberOfLines} editable={editable !== false}
      />
      {error ? <Text style={{ fontSize: 11, color: C.red, marginTop: 4, fontWeight: '600' }}>{error}</Text> : null}
    </>
  );
}

function PickBtn({ value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={[ui.inp, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[{ fontSize: 15, color: C.text }, !value && { color: '#bbb' }]}>{value || placeholder}</Text>
      <Text style={{ color: C.grey, fontSize: 14 }}>▾</Text>
    </TouchableOpacity>
  );
}

function YNU({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
      {[{ l: 'Yes', v: 'y' }, { l: 'No', v: 'n' }, { l: 'Unknown', v: 'u' }].map(o => {
        const sel = value === o.v;
        const bg  = sel ? (o.v === 'y' ? C.green : o.v === 'n' ? C.red : C.yellow) : C.greyLight;
        return (
          <TouchableOpacity key={o.v}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: sel ? bg : C.border, backgroundColor: bg, alignItems: 'center' }}
            onPress={() => onChange(o.v)} activeOpacity={0.8}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: sel ? 'white' : C.grey }}>{o.l}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CheckRow({ label, sublabel, checked, onChange }) {
  return (
    <TouchableOpacity style={[ui.checkRow, checked && { borderColor: C.red, backgroundColor: C.redLight }]} onPress={() => onChange(!checked)} activeOpacity={0.8}>
      <View style={[ui.checkBox, checked && { backgroundColor: C.red, borderColor: C.red }]}>
        {checked && <Text style={{ color: 'white', fontSize: 11, fontWeight: '800' }}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ui.checkLbl}>{label}</Text>
        {sublabel ? <Text style={{ fontSize: 12, color: C.grey, marginTop: 3 }}>{sublabel}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

function Btn({ label, onPress, disabled, color }) {
  return (
    <TouchableOpacity style={[ui.btn, { backgroundColor: disabled ? '#ccc' : (color || C.red) }]} onPress={onPress} disabled={!!disabled} activeOpacity={0.85}>
      <Text style={ui.btnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

function BtnGhost({ label, onPress }) {
  return (
    <TouchableOpacity style={[ui.btn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.border }]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[ui.btnTxt, { color: C.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomBar({ children }) {
  return <View style={ui.bottomBar}>{children}</View>;
}

function InfoBox({ icon, children }) {
  return (
    <View style={ui.infoBox}>
      {icon ? <Text style={{ fontSize: 18 }}>{icon}</Text> : null}
      <Text style={{ flex: 1, fontSize: 13, color: C.grey, lineHeight: 19 }}>{children}</Text>
    </View>
  );
}

function Disclaimer() {
  return (
    <View style={ui.disclaimer}>
      <Text style={ui.disclaimerTitle}>DECLARATION & DISCLAIMER</Text>
      <Text style={ui.disclaimerTxt}>This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.</Text>
    </View>
  );
}

function Banner({ claimable, label, description }) {
  return (
    <View style={[ui.banner, { backgroundColor: claimable ? C.greenLight : C.yellowLight, borderColor: claimable ? '#81C784' : '#FFD54F' }]}>
      <Text style={{ fontSize: 26 }}>{claimable ? '⚖️' : '⚠️'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[ui.bannerTitle, { color: claimable ? C.green2 : C.yellow2 }]}>{label}</Text>
        <Text style={[ui.bannerSub,   { color: claimable ? C.green2 : C.yellow2 }]}>{description}</Text>
      </View>
    </View>
  );
}

function Tabs({ tabs, active, onPress }) {
  return (
    <View style={ui.tabs}>
      {tabs.map((t, i) => (
        <TouchableOpacity key={t} style={[ui.tabBtn, i === active && { backgroundColor: C.red }]} onPress={() => onPress(i)}>
          <Text style={[{ fontSize: 13, fontWeight: '600', color: C.grey }, i === active && { color: 'white' }]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ListPicker({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{title}</Text>
          <FlatList data={options} keyExtractor={x => x} renderItem={({ item }) => (
            <TouchableOpacity style={ui.sheetItem} onPress={() => { onSelect(item); onClose(); }}>
              <Text style={{ fontSize: 15, color: C.text }}>{item}</Text>
            </TouchableOpacity>
          )} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple date picker built with modals — no native module needed
function DatePickerModal({ visible, value, onChange, onClose }) {
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();     // 0-indexed
  const todayD = now.getDate();

  const years  = Array.from({ length: 5 }, (_, i) => String(todayY - i));
  const parsed = value ? new Date(value) : now;

  const [selYear,  setYear]  = useState(String(parsed.getFullYear()));
  const [selMonth, setMonth] = useState(MONTHS[parsed.getMonth()]);
  const [selDay,   setDay]   = useState(String(parsed.getDate()).padStart(2, '0'));
  const [step,     setStep]  = useState('year');

  // Available months: if selected year == today's year, only show months up to current month
  const availableMonths = Number(selYear) < todayY
    ? MONTHS
    : MONTHS.slice(0, todayM + 1);

  // Available days: if selected year + month == today, only show days up to today
  const daysInMonth = new Date(Number(selYear), MONTHS.indexOf(selMonth) + 1, 0).getDate();
  const isCurrentMonth = Number(selYear) === todayY && MONTHS.indexOf(selMonth) === todayM;
  const maxDay = isCurrentMonth ? todayD : daysInMonth;
  const availableDays = Array.from({ length: maxDay }, (_, i) => String(i + 1).padStart(2, '0'));

  const confirm = (day) => {
    const mi = MONTHS.indexOf(selMonth);
    const d  = new Date(Number(selYear), mi, Number(day));
    onChange(d.toISOString());
    onClose();
    setStep('year');
  };

  const lists  = { year: years, month: availableMonths, day: availableDays };
  const titles = { year: 'Select Year (accident cannot be in the future)', month: 'Select Month', day: 'Select Day' };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{titles[step]}</Text>
          <Text style={{ fontSize: 12, color: C.grey, marginBottom: 10 }}>
            Selected: {selDay} {selMonth} {selYear}
          </Text>
          <FlatList
            data={lists[step]}
            keyExtractor={x => x}
            renderItem={({ item }) => {
              const cur = step === 'year' ? selYear : step === 'month' ? selMonth : selDay;
              return (
                <TouchableOpacity
                  style={[ui.sheetItem, item === cur && { backgroundColor: C.redLight }]}
                  onPress={() => {
                    if (step === 'year') {
                      setYear(item);
                      // If switching to a year where current selMonth is now in the future, reset month
                      if (Number(item) === todayY && MONTHS.indexOf(selMonth) > todayM) {
                        setMonth(MONTHS[todayM]);
                        setDay(String(todayD).padStart(2, '0'));
                      }
                      setStep('month');
                    }
                    if (step === 'month') {
                      setMonth(item);
                      // If switching to current month and selDay > today, reset day
                      if (Number(selYear) === todayY && MONTHS.indexOf(item) === todayM && Number(selDay) > todayD) {
                        setDay(String(todayD).padStart(2, '0'));
                      }
                      setStep('day');
                    }
                    if (step === 'day') { setDay(item); confirm(item); }
                  }}>
                  <Text style={[{ fontSize: 15, color: C.text }, item === cur && { color: C.red, fontWeight: '700' }]}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={[ui.btn, { backgroundColor: C.red, marginTop: 10 }]} onPress={onClose}>
            <Text style={ui.btnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple time picker
function TimePickerModal({ visible, value, onChange, onClose }) {
  const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const [selH, setH] = useState(value ? value.split(':')[0] : '08');
  const [selM, setM] = useState(value ? value.split(':')[1] : '00');
  const [step, setStep] = useState('hour');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={ui.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={ui.sheet}>
          <View style={ui.sheetHandle} />
          <Text style={ui.sheetTitle}>{step === 'hour' ? 'Select Hour' : 'Select Minute'}</Text>
          <Text style={{ fontSize: 12, color: C.grey, marginBottom: 10 }}>Selected: {selH}:{selM}</Text>
          <FlatList
            data={step === 'hour' ? hours : minutes}
            keyExtractor={x => x}
            renderItem={({ item }) => {
              const cur = step === 'hour' ? selH : selM;
              return (
                <TouchableOpacity
                  style={[ui.sheetItem, item === cur && { backgroundColor: C.redLight }]}
                  onPress={() => {
                    if (step === 'hour') { setH(item); setStep('minute'); }
                    else { setM(item); onChange(`${selH}:${item}`); onClose(); setStep('hour'); }
                  }}>
                  <Text style={[{ fontSize: 15, color: C.text }, item === cur && { color: C.red, fontWeight: '700' }]}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={[ui.btn, { backgroundColor: C.red, marginTop: 10 }]} onPress={onClose}>
            <Text style={ui.btnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function SectionHead({ children }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 }}>
      <View style={{ width: 4, height: 18, backgroundColor: C.red, borderRadius: 2 }} />
      <Text style={{ fontSize: 13, fontWeight: '800', color: C.red, textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</Text>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────
// SCREEN 0A — HOME / CATEGORY PICKER
// ─────────────────────────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const [selectedCat, setSelectedCat] = useState(AFFIDAVIT_CATEGORIES[0]);

  return (
    <View style={{ flex: 1, backgroundColor: C.red }}>
      <StatusBar barStyle="light-content" backgroundColor={C.red} />
      {/* SA flag stripes */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%', backgroundColor: C.green }} />
      <View style={{ position: 'absolute', bottom: '34%', left: 0, right: 0, height: '5%', backgroundColor: C.yellow }} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 36, paddingBottom: 32 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Image source={{ uri: LOGO_B64 }} style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', marginBottom: 16 }} resizeMode="contain" />
            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white', letterSpacing: -0.5, textAlign: 'center' }}>
              Affidavit<Text style={{ color: C.yellow }}>Assist</Text>
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
              by MyLawSA
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 10, lineHeight: 20 }}>
              What type of statement do you need help with?
            </Text>
          </View>

          {/* Category cards */}
          {AFFIDAVIT_CATEGORIES.map(cat => {
            const isSelected = selectedCat.id === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={{
                  backgroundColor: isSelected ? 'white' : 'rgba(255,255,255,0.12)',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? C.yellow : 'transparent',
                  padding: 16,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
                onPress={() => setSelectedCat(cat)}
                activeOpacity={0.8}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: isSelected ? cat.colour : 'rgba(255,255,255,0.15)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: isSelected ? C.text : 'white' }}>{cat.label}</Text>
                    {cat.isDefault && (
                      <View style={{ backgroundColor: C.yellow, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: 'white', letterSpacing: 0.5 }}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, color: isSelected ? C.grey : 'rgba(255,255,255,0.6)', marginTop: 3, lineHeight: 17 }}>{cat.description}</Text>
                </View>
                <Text style={{ fontSize: 20, color: isSelected ? C.red : 'rgba(255,255,255,0.4)' }}>{isSelected ? '●' : '○'}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Continue button */}
          <TouchableOpacity
            style={{
              backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 17,
              alignItems: 'center', marginTop: 8, marginBottom: 16,
              shadowColor: C.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
            }}
            onPress={() => navigation.navigate('TypePicker', { category: selectedCat })}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>
              Select: {selectedCat.label} →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Reports')} activeOpacity={0.85}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, textDecorationLine: 'underline' }}>
              View My Existing Drafts
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20, lineHeight: 15 }}>
            This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 0B — TYPE PICKER (sub-types within a category)
// ─────────────────────────────────────────────────────────────────
function TypePickerScreen({ navigation, route }) {
  const { category } = route.params;
  const [selectedType, setSelectedType] = useState(category.types[0]);

  const accentCol = category.colour;

  return (
    <View style={{ flex: 1, backgroundColor: accentCol }}>
      <StatusBar barStyle="light-content" backgroundColor={accentCol} />
      {/* Subtle bottom stripe */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', backgroundColor: 'rgba(0,0,0,0.15)' }} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32 }}>
          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24, lineHeight: 28 }}>‹</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Back to Categories</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Text style={{ fontSize: 32 }}>{category.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.3 }}>{category.label}</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Select statement type</Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 20, marginBottom: 24 }}>
            {category.description}
          </Text>

          {/* Type list */}
          {category.types.map(type => {
            const isSelected = selectedType.id === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={{
                  backgroundColor: isSelected ? 'white' : 'rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: isSelected ? C.yellow : 'transparent',
                  padding: 16,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
                onPress={() => setSelectedType(type)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: isSelected ? C.text : 'white', marginBottom: 4 }}>{type.label}</Text>
                  <Text style={{ fontSize: 12, color: isSelected ? C.grey : 'rgba(255,255,255,0.6)', lineHeight: 17 }}>{type.description}</Text>
                </View>
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: isSelected ? accentCol : 'rgba(255,255,255,0.2)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <Text style={{ color: 'white', fontSize: 13, fontWeight: '800' }}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Splash / intro card for selected type */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14,
            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
            padding: 18, marginTop: 8, marginBottom: 16,
          }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: C.yellow, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              {selectedType.label}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20 }}>
              {getStatementIntro(selectedType.id)}
            </Text>
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={{
              backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 17,
              alignItems: 'center', marginBottom: 12,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
            }}
            onPress={async () => {
              if (selectedType.id === 'vehicle_accident') {
                navigation.navigate('Splash', { statementType: selectedType });
              } else {
                navigation.navigate('StatementSplash', { statementType: selectedType, category });
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>
              Start: {selectedType.label} →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Reports')} activeOpacity={0.85}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, textDecorationLine: 'underline' }}>
              View My Existing Drafts
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 0C — STATEMENT SPLASH (per-type intro for non-vehicle types)
// ─────────────────────────────────────────────────────────────────
function StatementSplashScreen({ navigation, route }) {
  const { statementType, category } = route.params;
  const info = getStatementSplashInfo(statementType.id);
  const accentCol = category.colour;

  return (
    <View style={{ flex: 1, backgroundColor: accentCol }}>
      <StatusBar barStyle="light-content" backgroundColor={accentCol} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', backgroundColor: 'rgba(0,0,0,0.2)' }} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 28, alignItems: 'center' }}>
          {/* Logo */}
          <Image source={{ uri: LOGO_B64 }} style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', marginBottom: 20 }} resizeMode="contain" />

          {/* Icon + title */}
          <Text style={{ fontSize: 48, marginBottom: 12 }}>{category.icon}</Text>
          <Text style={{ fontSize: 30, fontWeight: '800', color: 'white', textAlign: 'center', letterSpacing: -0.5, lineHeight: 36, marginBottom: 8 }}>
            {statementType.label}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            {category.label} · AffidavitAssist
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 23, marginBottom: 24 }}>
            {info.intro}
          </Text>

          {/* What you need card */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', padding: 18, width: '100%', marginBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: C.yellow, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>📋 What you will need</Text>
            {info.needs.map((n, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
                <Text style={{ color: C.yellow, fontWeight: '800', fontSize: 13 }}>•</Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, flex: 1, lineHeight: 19 }}>{n}</Text>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            A FREE SERVICE BY MYLAWSA
          </Text>

          <TouchableOpacity
            style={{ width: '100%', backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginBottom: 12, shadowColor: C.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
            onPress={async () => {
              const d = createDraft(statementType.id);
              await saveDraft(d);
              navigation.navigate('GenericConsent', { draft: d, statementType, category });
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>Get Started →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '100%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
            onPress={() => navigation.navigate('Reports')}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' }}>I Have an Existing Draft</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 15 }}>
            This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────
// STATEMENT SPLASH CONTENT HELPER
// Per-type intro text and "what you need" bullets
// ─────────────────────────────────────────────────────────────────
function getStatementIntro(typeId) {
  const map = {
    vehicle_accident:       'Step-by-step guided statement for road traffic accidents. Covers collision circumstances, other parties, and damage — ready for SAPS or your insurer.',
    crime_theft_personal:   'Guided statement for theft of personal items such as a cellphone, wallet, laptop, or bag. Captures incident details for SAPS case number purposes.',
    crime_theft_vehicle:    'Statement for theft from or of a motor vehicle. Covers what was taken, vehicle details, and circumstances of the theft.',
    crime_theft_docs:       "Statement for the theft of identity documents including ID book, smart ID, passport, or driver's licence.",
    crime_burglary_res:     'Statement for a residential break-in or burglary. Captures entry points, items taken, and circumstances of the incident.',
    crime_burglary_biz:     'Statement for a burglary or break-in at business premises. Covers damage, items taken, and security circumstances.',
    crime_burglary_attempt: 'Statement for an attempted break-in where no successful entry was made. Captures attempt circumstances and evidence.',
    crime_assault:          'Statement for a physical assault. Captures the attacker description, nature of injuries, and incident circumstances.',
    crime_assault_gbh:      'Statement for assault with intent to cause grievous bodily harm. Covers weapon use, injury severity, and incident detail.',
    crime_threats:          'Statement for verbal or written threats and intimidation. Captures threat content, method of delivery, and context.',
    crime_fraud_accounts:   'Statement for fraudulent accounts or contracts opened in your name without consent. Covers discovered accounts and suspected perpetrators.',
    crime_fraud_financial:  'Statement for credit or financial fraud including unauthorized transactions.',
    crime_fraud_docs:       'Statement for forged, falsified, or fraudulently used documents.',
    crime_fraud_info:       'Statement for the unauthorized use of your personal information.',
    crime_damage_malicious: 'Statement for malicious and intentional damage to your property.',
    crime_damage_vandalism: 'Statement for vandalism, graffiti, or defacement of your property.',
    doc_lost_id:            'Statement for a lost or misplaced South African ID book or smart ID card — required for Home Affairs replacement.',
    doc_lost_passport:      'Statement for a lost or misplaced passport — required by the Department of Home Affairs.',
    doc_lost_licence:       "Statement for a lost driver's licence card — required by the DLTC for a replacement card.",
    doc_lost_bankcard:      'Statement for a lost bank, debit, or credit card.',
    doc_lost_access:        'Statement for a lost workplace access card or security pass.',
    doc_lost_vehicle:       'Statement for lost vehicle registration or licensing documents.',
    fin_property_loss:      'Statement for property lost or destroyed due to fire, natural disaster, or accident — for insurance or civil purposes.',
    fin_income_verify:      'Income or residence verification statement for banks, financial institutions, or government departments.',
    fin_employment:         'Statement explaining a suspension, dismissal, retrenchment, or change in employment status.',
    fin_insurance:          'Insurance-related statement covering loss, damage descriptions, or incident declarations for a claim.',
    pers_address:           'Proof of residential address statement for official or institutional purposes.',
    pers_residency:         'Residency status statement for students, tenants, or visitors requiring proof.',
    pers_incident:          'General incident description where no formal documentation currently exists.',
    pers_guardianship:      'Statement confirming guardianship or parental responsibility for a minor child.',
    pers_household:         'Statement describing household circumstances for welfare, government, or institutional purposes.',
    legal_witness:          'Formal witness statement for court or police proceedings.',
    legal_court_docs:       'Statement regarding lost or missing court documents.',
    legal_sars:             'SARS-related statement for a lost IRP5, unknown bank deposits, or tax declarations.',
    legal_labour:           'Department of Labour statement for lost employment records or related declarations.',
    other_parcel:           'Statement for a lost parcel or item in transit — for courier or insurance purposes.',
    other_suspicious:       'Statement reporting suspicious activity observed at a residence or business.',
    other_workplace:        'Statement for an accident or incident that occurred in the workplace.',
    other_animal:           'Statement for an animal bite, attack, or damage caused by an animal.',
  };
  return map[typeId] || 'Guided affidavit statement — step by step.';
}

function getStatementSplashInfo(typeId) {
  const map = {
    crime_theft_personal:   { intro: 'We will guide you through creating a complete affidavit for the theft of your personal belongings. This statement can be used to open a SAPS case and for insurance claim purposes.', needs: ['Your full name and ID number', 'Date, time, and location of the theft', 'Description of items stolen and their value', 'Any witness details if available', 'Any suspect description if observed'] },
    crime_theft_vehicle:    { intro: 'We will guide you through creating a complete affidavit for theft from or of your motor vehicle. This statement can be used to open a SAPS case and for insurance purposes.', needs: ['Your full name and ID number', 'Vehicle registration, make, model and colour', 'Date, time, and location of the theft', 'Description of items stolen or vehicle theft circumstances', 'Any witness or CCTV details if available'] },
    crime_theft_docs:       { intro: 'We will guide you through creating a complete affidavit for the theft of your identity documents. This is required to apply for replacement documents at Home Affairs or the DLTC.', needs: ['Your full name and ID number (from memory or other document)', 'Date, time, and location of the theft', 'Which documents were stolen', 'Circumstances of the theft', 'SAPS case number if already reported'] },
    crime_burglary_res:     { intro: 'We will guide you through creating a complete affidavit for a residential burglary. This statement captures everything needed for a SAPS case and insurance claim.', needs: ['Your full name and ID number', 'Address of the burglarised property', 'Date and time of the break-in (or when discovered)', 'Description of items stolen and their estimated value', 'Details of the point of entry and any damage caused'] },
    crime_burglary_biz:     { intro: 'We will guide you through creating a complete affidavit for a business premises burglary. This statement is suitable for SAPS, insurance, and business purposes.', needs: ['Your full name and ID number', 'Business name and address', 'Date and time of the break-in (or when discovered)', 'Description of items stolen and their estimated value', 'Details of the point of entry, alarm systems, and any CCTV'] },
    crime_burglary_attempt: { intro: 'We will guide you through creating a complete affidavit for an attempted burglary where no successful entry was made.', needs: ['Your full name and ID number', 'Address of the property', 'Date and time of the attempted break-in', 'Description of the point of attempted entry', 'Any witness or CCTV details'] },
    crime_assault:          { intro: 'We will guide you through creating a complete affidavit for a physical assault. This statement can be used to open a SAPS case and for medical or legal purposes.', needs: ['Your full name and ID number', 'Date, time, and location of the assault', 'Description of the attacker (if known)', 'Description of injuries sustained', 'Witness details if available'] },
    crime_assault_gbh:      { intro: 'We will guide you through creating a complete affidavit for assault with intent to cause grievous bodily harm. This is a serious criminal offence and this statement supports both SAPS and court proceedings.', needs: ['Your full name and ID number', 'Date, time, and location of the assault', 'Description of the attacker and any weapons used', 'Medical records or hospital visit details', 'Witness details if available'] },
    crime_threats:          { intro: 'We will guide you through creating a complete affidavit for threats or intimidation. This statement can be used to apply for a protection order or to open a SAPS case.', needs: ['Your full name and ID number', 'Identity of the person making threats (if known)', 'Date, time, and nature of each threat or incident', 'Method of the threat (verbal, written, electronic)', 'Any supporting evidence such as messages or recordings'] },
    crime_fraud_accounts:   { intro: 'We will guide you through creating a complete affidavit for fraudulent accounts opened in your name. This statement is required by credit bureaus, banks, and the SAPS to begin the fraud resolution process.', needs: ['Your full name and ID number', 'Details of the fraudulently opened accounts', 'When you discovered the fraud and how', 'Any suspected perpetrators if known', 'Any supporting correspondence from banks or creditors'] },
    crime_fraud_financial:  { intro: 'We will guide you through creating a complete affidavit for credit or financial fraud including unauthorized transactions.', needs: ['Your full name and ID number', 'Details of the unauthorized transactions or credit agreements', 'Date discovered and how it was discovered', 'Financial institutions involved', 'Any communications from the institutions'] },
    crime_fraud_docs:       { intro: 'We will guide you through creating a complete affidavit for forged, falsified, or fraudulently used documents.', needs: ['Your full name and ID number', 'Description of the document(s) involved', 'How and when you became aware of the forgery', 'Any known or suspected perpetrators', 'Copies of any related correspondence'] },
    crime_fraud_info:       { intro: 'We will guide you through creating a complete affidavit for the unauthorized use of your personal information.', needs: ['Your full name and ID number', 'What information was used without your consent', 'How you became aware of the misuse', 'Any known or suspected perpetrators', 'Evidence of the unauthorized use'] },
    crime_damage_malicious: { intro: 'We will guide you through creating a complete affidavit for malicious or intentional damage to your property.', needs: ['Your full name and ID number', 'Address or location of the damaged property', 'Description of the damage and estimated value', 'Identity of the suspected perpetrator if known', 'Date and time of the incident'] },
    crime_damage_vandalism: { intro: 'We will guide you through creating a complete affidavit for vandalism or graffiti on your property.', needs: ['Your full name and ID number', 'Address or location of the affected property', 'Description and extent of the vandalism', 'Date and time of the incident', 'Any CCTV or witness details'] },
    doc_lost_id:            { intro: 'We will guide you through creating a complete affidavit for a lost South African ID book or smart ID card. This document is required by the Department of Home Affairs to process your replacement application.', needs: ['Your full name and ID number (from memory)', 'Your date of birth and place of birth', 'Date and circumstances of when the ID was lost', 'Whether the loss was due to theft or misplacement', 'Your residential address'] },
    doc_lost_passport:      { intro: 'We will guide you through creating a complete affidavit for a lost South African or foreign passport. This is required by the Department of Home Affairs or the relevant embassy.', needs: ['Your full name and ID number', 'Passport number if known', 'Date and circumstances of when the passport was lost', 'Whether the loss was due to theft or misplacement', 'Your residential address'] },
    doc_lost_licence:       { intro: "We will guide you through creating a complete affidavit for a lost driver's licence card. This is required by the Driving Licence Testing Centre (DLTC) to process your replacement.", needs: ['Your full name and ID number', "Driver's licence number if known", 'Date and circumstances of when the licence was lost', 'Whether the loss was due to theft or misplacement', 'Your residential address'] },
    doc_lost_bankcard:      { intro: 'We will guide you through creating a complete affidavit for a lost bank, debit, or credit card. Some banks or financial institutions require this for replacement or fraud investigation.', needs: ['Your full name and ID number', 'Bank name and account type', 'Last four digits of the card if known', 'Date and circumstances of the loss', 'Whether you suspect the card was stolen'] },
    doc_lost_access:        { intro: 'We will guide you through creating a complete affidavit for a lost workplace access card or security pass. This is typically required by your employer or security provider.', needs: ['Your full name and ID number', 'Employer or company name', 'Type of access card and its reference number if known', 'Date and circumstances of the loss', 'Your residential address'] },
    doc_lost_vehicle:       { intro: 'We will guide you through creating a complete affidavit for lost vehicle registration or licensing documents. This is required by the Department of Transport for replacement.', needs: ['Your full name and ID number', 'Vehicle registration number, make, model, and colour', 'Documents that were lost', 'Date and circumstances of the loss', 'Your residential address'] },
    fin_property_loss:      { intro: 'We will guide you through creating a complete affidavit for property lost or destroyed due to fire, natural disaster, or accident. This is required for insurance claims or civil proceedings.', needs: ['Your full name and ID number', 'Address or location of the property', 'Description of lost or destroyed items and their estimated value', 'Date and nature of the incident', 'Any supporting reports (fire brigade, SAPS, municipal)'] },
    fin_income_verify:      { intro: 'We will guide you through creating a complete income or residence verification affidavit for banks, financial institutions, or government departments.', needs: ['Your full name and ID number', 'Your residential address', 'Current employment status and employer details', 'Monthly income amount', 'Purpose of the verification statement'] },
    fin_employment:         { intro: 'We will guide you through creating a complete affidavit explaining a change in employment status such as suspension, dismissal, or retrenchment.', needs: ['Your full name and ID number', 'Employer name and address', 'Nature of the employment change', 'Date the change took effect', 'Any supporting correspondence from your employer'] },
    fin_insurance:          { intro: 'We will guide you through creating a complete insurance-related affidavit for loss, damage, or claim purposes.', needs: ['Your full name and ID number', 'Insurance company name and policy number', 'Description of the insured item or property', 'Nature and date of the loss or damage', 'Estimated value of the claim'] },
    pers_address:           { intro: 'We will guide you through creating a complete proof of address affidavit for official or institutional purposes.', needs: ['Your full name and ID number', 'Your current residential address', 'How long you have resided at this address', 'Purpose of the proof of address', 'Name of a person who can confirm your address if required'] },
    pers_residency:         { intro: 'We will guide you through creating a complete residency status affidavit for students, tenants, or visitors.', needs: ['Your full name and ID number', 'Your current address and status (student, tenant, visitor)', 'Name of the property owner or institution if applicable', 'Duration of your stay at the address', 'Purpose of the residency statement'] },
    pers_incident:          { intro: 'We will guide you through creating a general incident description affidavit where no formal documentation currently exists.', needs: ['Your full name and ID number', 'Date, time, and location of the incident', 'A clear description of what happened', 'Names of any other parties or witnesses involved', 'Purpose or intended recipient of the statement'] },
    pers_guardianship:      { intro: 'We will guide you through creating a complete guardianship affidavit confirming your responsibility for a minor child.', needs: ['Your full name and ID number', "The minor's full name and date of birth", 'Your relationship to the minor', 'Biological parent or guardian details if applicable', 'Purpose of the guardianship statement'] },
    pers_household:         { intro: 'We will guide you through creating a complete household circumstances statement for welfare, government, or institutional purposes.', needs: ['Your full name and ID number', 'Your residential address', 'Names and ages of all household members', 'Current income and employment status of household', 'Purpose of the household statement'] },
    legal_witness:          { intro: 'We will guide you through creating a formal witness statement for court or police proceedings. This statement must be accurate and truthful as it may be used in legal proceedings.', needs: ['Your full name and ID number', 'Your relationship to the matter (bystander, victim, participant)', 'Date, time, and location of the incident you witnessed', 'A clear and chronological account of what you witnessed', 'Contact details for follow-up by investigators or attorneys'] },
    legal_court_docs:       { intro: 'We will guide you through creating a complete affidavit for lost court documents. This is required by the court registrar for replacement or duplication of documents.', needs: ['Your full name and ID number', 'Case number and court name if known', 'Description of the lost documents', 'Date and circumstances of the loss', "Your attorney's details if applicable"] },
    legal_sars:             { intro: 'We will guide you through creating a complete SARS-related affidavit for lost IRP5 documents, unknown bank deposits, or other SARS-related declarations.', needs: ['Your full name and ID number', 'Your tax reference number', 'Tax year in question', 'Description of the declaration or lost document', 'Employer details if IRP5-related'] },
    legal_labour:           { intro: 'We will guide you through creating a complete Department of Labour affidavit for lost employment records or related declarations.', needs: ['Your full name and ID number', 'Previous employer name and address', 'Employment dates', 'Description of the lost or unavailable records', 'Purpose of the declaration'] },
    other_parcel:           { intro: 'We will guide you through creating a complete affidavit for a lost parcel or item in transit. This is typically required by the courier company or for insurance purposes.', needs: ['Your full name and ID number', 'Courier or transport company name', 'Tracking number or reference if available', 'Description of the parcel contents and value', 'Date sent and expected delivery date'] },
    other_suspicious:       { intro: 'We will guide you through creating a complete affidavit for suspicious activity observed at a residence or business.', needs: ['Your full name and ID number', 'Address where the activity was observed', 'Date, time, and description of the suspicious activity', 'Description of suspicious persons or vehicles', 'Any actions already taken (neighbourhood watch, SAPS report)'] },
    other_workplace:        { intro: 'We will guide you through creating a complete affidavit for a workplace accident or incident. This is required for compensation, insurance, or disciplinary purposes.', needs: ['Your full name and ID number', 'Employer name and workplace address', 'Date, time, and location of the incident within the workplace', 'Description of the accident or incident', 'Names of witnesses or supervisors present'] },
    other_animal:           { intro: 'We will guide you through creating a complete affidavit for an animal-related incident such as a bite, attack, or property damage caused by an animal.', needs: ['Your full name and ID number', 'Date, time, and location of the incident', 'Description of the animal and its owner if known', 'Nature of injuries or damages sustained', 'Medical treatment received if any'] },
  };
  return map[typeId] || {
    intro: 'We will guide you step by step through creating a complete and accurate affidavit statement.',
    needs: ['Your full name and ID number', 'Date and location of the relevant incident', 'A description of the circumstances', 'Witness or other party details if applicable'],
  };
}


// ─────────────────────────────────────────────────────────────────
// GENERIC QUESTION FLOWS (all non-vehicle statement types)
// Each type has sections, each section has fields
// field types: text | textarea | ynu | date | picker
// ─────────────────────────────────────────────────────────────────

const GENERIC_FLOWS = {

  // ── CRIME ─────────────────────────────────────────────────────
  crime_theft_personal: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'e.g. Thabo Nkosi' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',        label:'Date of Theft',                type:'date',     required:true },
        { id:'time',        label:'Approximate Time',             type:'time',     required:true },
        { id:'location',    label:'Location / Address of Theft',  type:'text',     required:true,  placeholder:'e.g. Corner Main & First Street, Johannesburg' },
        { id:'province',    label:'Province',                     type:'picker',   required:false, options:'PROVINCES' },
      ]},
      { title: 'Items Stolen', fields: [
        { id:'items',       label:'Describe Items Stolen',        type:'textarea', required:true,  placeholder:'List each item, include make/model/serial numbers where possible' },
        { id:'totalValue',  label:'Estimated Total Value (R)',    type:'text',     required:false, placeholder:'e.g. R 8 500', keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 8 500', keyboard:'numeric' },
        { id:'serialNums',  label:'Serial / IMEI Numbers (if known)', type:'text', required:false, placeholder:'e.g. IMEI: 356938035643809' },
      ]},
      { title: 'Circumstances', fields: [
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'circumstances', label:'Describe What Happened',     type:'textarea', required:true,  placeholder:'Describe clearly what happened leading up to, during, and after the theft' },
        { id:'suspectDesc',   label:'Suspect Description (if seen)', type:'textarea', required:false, placeholder:'e.g. Male, approximately 25 years, wearing red jacket' },
        { id:'witnessName',   label:'Witness Name (if any)',      type:'text',     required:false, placeholder:'Full name of witness' },
        { id:'witnessCell',   label:'Witness Contact Number',     type:'text',     required:false, placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
        { id:'caseNumber',    label:'SAPS Case Number (if obtained)', type:'text', required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_theft_vehicle: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Vehicle Details', fields: [
        { id:'vehicleReg',  label:'Vehicle Registration',         type:'text',     required:true,  placeholder:'e.g. GP 123-456' },
        { id:'vehicleMake', label:'Make',                         type:'text',     required:true,  placeholder:'e.g. Toyota' },
        { id:'vehicleModel',label:'Model',                        type:'text',     required:true,  placeholder:'e.g. Hilux' },
        { id:'vehicleColour',label:'Colour',                      type:'text',     required:true,  placeholder:'e.g. White' },
        { id:'vehicleYear', label:'Year',                         type:'text',     required:false, placeholder:'e.g. 2020', keyboard:'numeric' },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',           label:'Date of Incident',          type:'date',     required:true },
        { id:'time',           label:'Approximate Time',          type:'time',     required:true },
        { id:'location',       label:'Location / Address',        type:'text',     required:true,  placeholder:'Where did the theft occur?' },
        { id:'theftType',      label:'What was stolen?',          type:'picker',   required:true,  options:['The entire vehicle','Items from inside the vehicle','Vehicle parts (wheels, catalytic converter, etc.)','Attempted theft — nothing taken'] },
        { id:'itemsStolen',    label:'Describe Items / Damage',   type:'textarea', required:true,  placeholder:'Describe what was taken or what damage was caused' },
        { id:'circumstances',  label:'Circumstances',             type:'textarea', required:true,  placeholder:'How did you discover the theft? What did you observe?' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',     label:'SAPS Case Number (if obtained)', type:'text',required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_theft_docs: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID Number (from memory)',       type:'text',     required:true,  placeholder:'13-digit SA ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'dob',         label:'Date of Birth',                type:'date',     required:true },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Documents Stolen', fields: [
        { id:'docsStolen',  label:'Which documents were stolen?', type:'picker',   required:true,  options:['ID Book','Smart ID Card','Passport',"Driver's Licence",'All of the above','Other combination'] },
        { id:'docsOther',   label:'Other documents (specify)',    type:'text',     required:false, placeholder:'Describe any other documents stolen' },
        { id:'passportNum', label:'Passport Number (if known)',   type:'text',     required:false, placeholder:'Passport number' },
        { id:'licenceNum',  label:'Licence Number (if known)',    type:'text',     required:false, placeholder:"Driver's licence number" },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Theft',               type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'location',     label:'Location / Address',          type:'text',     required:true,  placeholder:'Where were the documents stolen?' },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true,  placeholder:'How were the documents stolen? What happened?' },
        { id:'caseNumber',   label:'SAPS Case Number (if obtained)', type:'text',  required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_burglary_res: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Property Details', fields: [
        { id:'propertyAddress', label:'Address of Burglarised Property', type:'text', required:true, placeholder:'Full address' },
        { id:'ownerOrTenant',   label:'Your status at this property',    type:'picker', required:true, options:['Owner','Tenant','Family Member','Caretaker'] },
        { id:'province',        label:'Province',                        type:'picker', required:false, options:'PROVINCES' },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',          label:'Date of Burglary',             type:'date',     required:true },
        { id:'discoveredTime',label:'Time Discovered / Approximate Time of Entry', type:'time', required:false },
        { id:'entryPoint',    label:'Point of Entry',               type:'textarea', required:true, placeholder:'e.g. Back bedroom window forced open; kitchen door lock broken' },
        { id:'alarmSystem',   label:'Was a security/alarm system present?', type:'ynu', required:false },
        { id:'alarmDetails',  label:'Alarm / security details',     type:'text',     required:false, placeholder:'e.g. ADT alarm, armed response, electric fence' },
      ]},
      { title: 'Items Stolen', fields: [
        { id:'itemsStolen',   label:'Describe All Items Stolen',    type:'textarea', required:true, placeholder:'List items — include make, model, serial numbers, estimated value' },
        { id:'totalValue',    label:'Estimated Total Value (R)',    type:'text',     required:false, placeholder:'e.g. R 45 000', keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 45 000', keyboard:'numeric' },
        { id:'damageDesc',    label:'Property Damage Caused',       type:'textarea', required:false, placeholder:'Describe any damage caused during the break-in' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',    label:'SAPS Case Number',             type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_burglary_biz: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
        { id:'role',        label:'Your role at the business',    type:'text',     required:true,  placeholder:'e.g. Owner, Manager, Director' },
      ]},
      { title: 'Business Details', fields: [
        { id:'bizName',     label:'Business Name',                type:'text',     required:true,  placeholder:'Registered business name' },
        { id:'bizAddress',  label:'Business Address',             type:'text',     required:true,  placeholder:'Full business address' },
        { id:'bizReg',      label:'Business Registration Number', type:'text',     required:false, placeholder:'e.g. 2010/123456/07' },
        { id:'province',    label:'Province',                     type:'picker',   required:false, options:'PROVINCES' },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Burglary',            type:'date',     required:true },
        { id:'discoveredBy', label:'Who discovered the break-in?',type:'text',     required:true, placeholder:'Name and relationship to the business' },
        { id:'entryPoint',   label:'Point of Entry',              type:'textarea', required:true, placeholder:'e.g. Back storeroom door, roller shutter forced' },
        { id:'securityDesc', label:'Security measures in place',  type:'textarea', required:false, placeholder:'e.g. CCTV cameras, alarm system, security guard, electric fence' },
        { id:'itemsStolen',  label:'Items / Cash / Stock Stolen', type:'textarea', required:true, placeholder:'List all stolen items with estimated values' },
        { id:'totalValue',   label:'Estimated Total Value (R)',   type:'text',     required:false, placeholder:'e.g. R 120 000', keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_burglary_attempt: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Attempted Burglary',  type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'attemptPoint', label:'Point of Attempted Entry',    type:'textarea', required:true, placeholder:'e.g. Front door lock tampered with; window frame forced but not opened' },
        { id:'circumstances',label:'What happened?',              type:'textarea', required:true, placeholder:'Describe how you discovered the attempt and what you observed' },
        { id:'suspectDesc',  label:'Suspect Description (if seen)', type:'textarea', required:false, placeholder:'Physical description, clothing, vehicle used' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_assault: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',          label:'Date of Assault',            type:'date',     required:true },
        { id:'time',          label:'Approximate Time',           type:'time',     required:true },
        { id:'location',      label:'Location / Address',         type:'text',     required:true, placeholder:'Where did the assault occur?' },
        { id:'province',      label:'Province',                   type:'picker',   required:false, options:'PROVINCES' },
      ]},
      { title: 'Attacker Details', fields: [
        { id:'attackerKnown', label:'Is the attacker known to you?', type:'ynu',  required:true },
        { id:'attackerName',  label:"Attacker's Name (if known)",  type:'text',  required:false, placeholder:'Full name if known' },
        { id:'attackerDesc',  label:'Physical Description',         type:'textarea', required:true, placeholder:'e.g. Male, approx 30 years, 1.8m tall, wearing blue jeans and black hoodie' },
        { id:'weaponUsed',    label:'Was a weapon used?',           type:'ynu',   required:true },
        { id:'weaponDesc',    label:'Describe the weapon',          type:'text',  required:false, placeholder:'e.g. Kitchen knife, iron rod, firearm' },
      ]},
      { title: 'Injuries & Aftermath', fields: [
        { id:'injuries',      label:'Describe Your Injuries',       type:'textarea', required:true, placeholder:'e.g. Bruising to face, laceration on left arm, broken nose' },
        { id:'medicalTreatment', label:'Did you receive medical treatment?', type:'ynu', required:true },
        { id:'hospital',      label:'Hospital / Clinic Name',       type:'text',  required:false, placeholder:'Where were you treated?' },
        { id:'estimatedDamage', label:'Estimated Medical / Damage Costs (R)', type:'text', required:false, placeholder:'e.g. R 2 500', keyboard:'numeric' },
        { id:'circumstances', label:'Full Circumstances',           type:'textarea', required:true, placeholder:'Describe the full sequence of events before, during, and after the assault' },
        { id:'witnessName',   label:'Witness Name (if any)',        type:'text',  required:false, placeholder:'Witness full name' },
        { id:'witnessCell',   label:'Witness Contact',              type:'text',  required:false, placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',    label:'SAPS Case Number',             type:'text',  required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_assault_gbh: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Assault',             type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:true },
        { id:'location',     label:'Location / Address',          type:'text',     required:true, placeholder:'Where did the assault occur?' },
      ]},
      { title: 'Attacker & Weapon', fields: [
        { id:'attackerKnown',label:'Is the attacker known to you?', type:'ynu',   required:true },
        { id:'attackerName', label:"Attacker's Name (if known)", type:'text',    required:false, placeholder:'Full name if known' },
        { id:'attackerDesc', label:'Physical Description',         type:'textarea', required:true, placeholder:'Detailed description of the attacker' },
        { id:'weaponDesc',   label:'Weapon / Object Used',         type:'textarea', required:true, placeholder:'Describe in detail the weapon or object used' },
        { id:'numAttackers', label:'Number of attackers',          type:'text',    required:true, placeholder:'e.g. 1, 2, 3 or more', keyboard:'numeric' },
      ]},
      { title: 'Injuries & Medical', fields: [
        { id:'injuries',     label:'Describe Injuries in Detail', type:'textarea', required:true, placeholder:'Describe all injuries — be as specific as possible' },
        { id:'hospital',     label:'Hospital / Clinic Name',      type:'text',     required:true, placeholder:'Where were you treated?' },
        { id:'admissionDate',label:'Date of Admission',           type:'date',     required:false },
        { id:'medNotes',     label:'Medical notes or diagnosis',  type:'textarea', required:false, placeholder:'Any diagnosis or prognosis provided by medical staff' },
        { id:'circumstances',label:'Full Circumstances',          type:'textarea', required:true, placeholder:'Full sequence of events' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_threats: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  placeholder:'13-digit ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Perpetrator Details', fields: [
        { id:'perpName',    label:'Name of Person Making Threats', type:'text',    required:false, placeholder:'Full name if known' },
        { id:'perpRelation',label:'Your Relationship to Them',    type:'text',    required:false, placeholder:'e.g. Ex-partner, neighbour, colleague, unknown' },
        { id:'perpAddress', label:'Their Address (if known)',     type:'text',    required:false, placeholder:'Address of perpetrator' },
        { id:'perpDesc',    label:'Physical Description (if unknown)', type:'textarea', required:false, placeholder:'Description if identity is unknown' },
      ]},
      { title: 'Threat Details', fields: [
        { id:'firstIncident',label:'Date of First Incident',      type:'date',     required:true },
        { id:'lastIncident', label:'Date of Most Recent Incident',type:'date',     required:true },
        { id:'method',       label:'Method of Threats',           type:'picker',   required:true,  options:['Verbal — in person','Verbal — by phone','Written — letters or notes','Electronic — WhatsApp / SMS / Email','Social media','Combination of methods'] },
        { id:'threatContent',label:'Content of Threats',          type:'textarea', required:true,  placeholder:'Describe as accurately as possible what was said or written' },
        { id:'frequency',    label:'How often have threats occurred?', type:'text', required:true, placeholder:'e.g. Daily for the past 2 weeks, 3 separate incidents' },
        { id:'evidence',     label:'Evidence Available',          type:'textarea', required:false, placeholder:'e.g. Screenshots of messages, voicemail recordings, witness names' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_fraud_accounts: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true,  placeholder:'Your full name' },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  placeholder:'13-digit SA ID number', keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true,  placeholder:'Street, Suburb, City' },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  placeholder:'e.g. 0821234567', keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Fraudulent Accounts', fields: [
        { id:'discoveredDate', label:'When did you discover the fraud?', type:'date', required:true },
        { id:'howDiscovered',  label:'How was it discovered?',    type:'textarea', required:true,  placeholder:'e.g. Credit bureau check, bank notification, debt collector call' },
        { id:'accounts',       label:'Details of Fraudulent Accounts', type:'textarea', required:true, placeholder:'List each account: institution name, account type, amount, date opened' },
        { id:'totalExposure',  label:'Total Financial Exposure (R)', type:'text', required:false, placeholder:'e.g. R 85 000', keyboard:'numeric' },
        { id:'suspectedPerp',  label:'Suspected Perpetrator (if known)', type:'text', required:false, placeholder:'Name or relationship if known' },
        { id:'actionsTaken',   label:'Actions Already Taken',    type:'textarea', required:false, placeholder:'e.g. Contacted bank, placed fraud alert on credit bureau, reported to police' },
        { id:'caseNumber',     label:'SAPS Case Number',          type:'text',     required:false, placeholder:'e.g. CAS 123/02/2025' },
      ]},
    ],
  },

  crime_fraud_financial: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Fraud Details', fields: [
        { id:'institution',  label:'Financial Institution',       type:'text',     required:true,  placeholder:'Bank or institution name' },
        { id:'accountNum',   label:'Account Number (last 4 digits)', type:'text', required:false, placeholder:'Last 4 digits only for security' },
        { id:'transactions', label:'Unauthorized Transactions',   type:'textarea', required:true,  placeholder:'List each transaction: date, amount, description' },
        { id:'totalAmount',  label:'Total Unauthorized Amount (R)', type:'text',  required:false, placeholder:'e.g. R 12 500', keyboard:'numeric' },
        { id:'discoveredDate',label:'When Discovered',            type:'date',     required:true },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true,  placeholder:'How the fraud occurred or was discovered' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },

  crime_fraud_docs: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Document Fraud Details', fields: [
        { id:'docType',      label:'Type of Document Involved',   type:'text',     required:true,  placeholder:'e.g. ID, contract, title deed, payslip' },
        { id:'forgerydesc',  label:'Nature of Forgery / Falsification', type:'textarea', required:true, placeholder:'Describe how the document was forged, altered, or misused' },
        { id:'discoveredDate',label:'When Discovered',            type:'date',     required:true },
        { id:'howDiscovered',label:'How Discovered',              type:'textarea', required:true,  placeholder:'How did you find out about the forgery?' },
        { id:'perpetrator',  label:'Suspected Perpetrator',       type:'text',     required:false, placeholder:'Name or description if known' },
        { id:'damage',       label:'Harm or Damage Suffered',     type:'textarea', required:true,  placeholder:'What loss, harm, or damage resulted from the fraud?' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },

  crime_fraud_info: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Misuse Details', fields: [
        { id:'infoType',     label:'What information was misused?', type:'textarea', required:true, placeholder:'e.g. ID number, address, phone number, banking details' },
        { id:'howUsed',      label:'How was it used without consent?', type:'textarea', required:true, placeholder:'Describe how your information was used' },
        { id:'discoveredDate',label:'When Discovered',            type:'date',     required:true },
        { id:'perpetrator',  label:'Suspected Perpetrator',       type:'text',     required:false },
        { id:'harm',         label:'Harm or Damage Suffered',     type:'textarea', required:true },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },

  crime_damage_malicious: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Damage Details', fields: [
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'propertyAddr', label:'Address of Damaged Property', type:'text',     required:true },
        { id:'damageDesc',   label:'Describe Damage in Detail',   type:'textarea', required:true,  placeholder:'What was damaged, how, and estimated repair cost' },
        { id:'repairValue',  label:'Estimated Repair Value (R)',  type:'text',     required:false, keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage Cost (R)', type:'text', required:false, placeholder:'e.g. R 12 000', keyboard:'numeric' },
        { id:'perpetrator',  label:'Perpetrator (if known)',      type:'text',     required:false },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true,  placeholder:'How did the damage occur? Was there a dispute or motive?' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },

  crime_damage_vandalism: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Vandalism Details', fields: [
        { id:'date',         label:'Date Discovered / Occurred',  type:'date',     required:true },
        { id:'propertyAddr', label:'Address of Affected Property',type:'text',     required:true },
        { id:'vandalismDesc',label:'Describe the Vandalism',      type:'textarea', required:true,  placeholder:'e.g. Graffiti sprayed on front wall, windows smashed, gate broken' },
        { id:'repairValue',  label:'Estimated Repair/Cleaning Cost (R)', type:'text', required:false, keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage Cost (R)', type:'text', required:false, placeholder:'e.g. R 5 000', keyboard:'numeric' },
        { id:'cctv',         label:'Is CCTV available in the area?', type:'ynu',   required:false },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },

  // ── DOCUMENTS ─────────────────────────────────────────────────
  doc_lost_id: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number (from memory)',       type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'dob',         label:'Date of Birth',                type:'date',     required:true },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Lost Document Details', fields: [
        { id:'docType',      label:'Document Type',               type:'picker',   required:true,  options:['ID Book (Green Barcoded)','Smart ID Card','Both'] },
        { id:'date',         label:'Date Lost / Stolen',          type:'date',     required:true },
        { id:'lossType',     label:'How was it lost?',            type:'picker',   required:true,  options:['Misplaced / Lost','Stolen','Destroyed / Damaged'] },
        { id:'location',     label:'Where was it lost?',          type:'text',     required:false, placeholder:'Location where lost or stolen' },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true,  placeholder:'Describe how the document was lost, stolen, or destroyed' },
        { id:'caseNumber',   label:'SAPS Case Number (if stolen)',type:'text',     required:false },
      ]},
    ],
  },

  doc_lost_passport: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'dob',         label:'Date of Birth',                type:'date',     required:true },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'nationality', label:'Nationality',                  type:'text',     required:true,  placeholder:'e.g. South African' },
      ]},
      { title: 'Passport Details', fields: [
        { id:'passportNum',  label:'Passport Number (if known)',  type:'text',     required:false },
        { id:'issueDate',    label:'Issue Date (if known)',       type:'date',     required:false },
        { id:'date',         label:'Date Lost / Stolen',          type:'date',     required:true },
        { id:'lossType',     label:'How was it lost?',            type:'picker',   required:true,  options:['Misplaced / Lost','Stolen','Destroyed / Damaged'] },
        { id:'location',     label:'Where was it lost?',          type:'text',     required:false },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true },
        { id:'caseNumber',   label:'SAPS Case Number (if stolen)',type:'text',     required:false },
      ]},
    ],
  },

  doc_lost_licence: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'dob',         label:'Date of Birth',                type:'date',     required:true },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Licence Details', fields: [
        { id:'licenceNum',   label:'Licence Number (if known)',   type:'text',     required:false },
        { id:'licenceCode',  label:'Licence Code',                type:'picker',   required:false, options:['Code 8 (Motor Vehicle)','Code 10 (Trucks)','Code 14 (Articulated Trucks)','Motorcycle','Other'] },
        { id:'date',         label:'Date Lost / Stolen',          type:'date',     required:true },
        { id:'lossType',     label:'How was it lost?',            type:'picker',   required:true,  options:['Misplaced / Lost','Stolen','Destroyed / Damaged'] },
        { id:'location',     label:'Where was it lost?',          type:'text',     required:false },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true },
        { id:'caseNumber',   label:'SAPS Case Number (if stolen)',type:'text',     required:false },
      ]},
    ],
  },

  doc_lost_bankcard: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Card Details', fields: [
        { id:'bankName',     label:'Bank Name',                   type:'text',     required:true,  placeholder:'e.g. FNB, ABSA, Standard Bank, Nedbank, Capitec' },
        { id:'cardType',     label:'Card Type',                   type:'picker',   required:true,  options:['Debit Card','Credit Card','Cheque Card','Both Debit and Credit'] },
        { id:'lastFour',     label:'Last 4 Digits of Card',       type:'text',     required:false, keyboard:'phone-pad', maxLen:4, placeholder:'Last 4 digits only' },
        { id:'cardCancelled',label:'Has the card been cancelled?',type:'ynu',      required:true },
        { id:'date',         label:'Date Lost / Stolen',          type:'date',     required:true },
        { id:'lossType',     label:'How was it lost?',            type:'picker',   required:true,  options:['Misplaced / Lost','Stolen'] },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true },
        { id:'caseNumber',   label:'SAPS Case Number (if stolen)',type:'text',     required:false },
      ]},
    ],
  },

  doc_lost_access: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'employer',    label:'Employer / Company',           type:'text',     required:true,  placeholder:'Name of employer or organisation' },
        { id:'role',        label:'Your Role / Position',         type:'text',     required:true },
      ]},
      { title: 'Card Details', fields: [
        { id:'cardRef',      label:'Card Reference / Number',     type:'text',     required:false, placeholder:'Reference number if known' },
        { id:'date',         label:'Date Lost / Stolen',          type:'date',     required:true },
        { id:'lossType',     label:'How was it lost?',            type:'picker',   required:true,  options:['Misplaced / Lost','Stolen'] },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true },
        { id:'reportedTo',   label:'Reported to (employer / security)', type:'text', required:false, placeholder:'Name and designation of person reported to' },
      ]},
    ],
  },

  doc_lost_vehicle: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Vehicle Details', fields: [
        { id:'vehicleReg',  label:'Vehicle Registration',         type:'text',     required:true },
        { id:'vehicleMake', label:'Make',                         type:'text',     required:true },
        { id:'vehicleModel',label:'Model',                        type:'text',     required:true },
        { id:'vehicleYear', label:'Year',                         type:'text',     required:false, keyboard:'numeric' },
      ]},
      { title: 'Lost Documents', fields: [
        { id:'docsLost',     label:'Documents Lost',              type:'picker',   required:true,  options:['Registration Certificate (RC1)','Licence Disc','Both RC1 and Licence Disc','Roadworthy Certificate','Other'] },
        { id:'date',         label:'Date Lost',                   type:'date',     required:true },
        { id:'circumstances',label:'Circumstances',               type:'textarea', required:true },
        { id:'caseNumber',   label:'SAPS Case Number (if stolen)',type:'text',     required:false },
      ]},
    ],
  },

  // ── FINANCIAL ─────────────────────────────────────────────────
  fin_property_loss: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Property Details', fields: [
        { id:'propertyAddr', label:'Address of Property Lost/Damaged', type:'text', required:true },
        { id:'causeOfLoss',  label:'Cause of Loss',               type:'picker',   required:true,  options:['Fire','Flood','Storm / Natural Disaster','Accident','Other'] },
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'itemsLost',    label:'Items Lost / Damaged',        type:'textarea', required:true,  placeholder:'List all items with estimated values' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'totalValue',   label:'Total Estimated Value (R)',   type:'text',     required:false, keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 250 000', keyboard:'numeric' },
        { id:'insurer',      label:'Insurance Company (if any)',  type:'text',     required:false },
        { id:'policyNum',    label:'Policy Number',               type:'text',     required:false },
        { id:'circumstances',label:'Full Circumstances',          type:'textarea', required:true },
      ]},
    ],
  },

  fin_income_verify: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Employment & Income', fields: [
        { id:'employerName', label:'Employer Name',               type:'text',     required:true },
        { id:'employerAddr', label:'Employer Address',            type:'text',     required:true },
        { id:'occupation',   label:'Occupation / Job Title',      type:'text',     required:true },
        { id:'employedSince',label:'Employed Since',              type:'date',     required:false },
        { id:'monthlyIncome',label:'Monthly Income (R)',          type:'text',     required:true,  keyboard:'numeric' },
        { id:'incomeType',   label:'Income Type',                 type:'picker',   required:true,  options:['Permanent Salaried Employment','Contract Employment','Self-Employed','Freelance / Commission','Social Grant','Other'] },
        { id:'purpose',      label:'Purpose of This Statement',   type:'text',     required:true,  placeholder:'e.g. Home loan application, rental application' },
      ]},
    ],
  },

  fin_employment: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Employment Details', fields: [
        { id:'employerName', label:'Employer Name',               type:'text',     required:true },
        { id:'employerAddr', label:'Employer Address',            type:'text',     required:true },
        { id:'occupation',   label:'Position / Job Title',        type:'text',     required:true },
        { id:'changeType',   label:'Nature of Employment Change', type:'picker',   required:true,  options:['Resignation','Retrenchment','Dismissal / Termination','Suspension','Change in Job Title / Duties','Other'] },
        { id:'changeDate',   label:'Date Change Took Effect',     type:'date',     required:true },
        { id:'explanation',  label:'Explanation of Circumstances',type:'textarea', required:true,  placeholder:'Describe the circumstances of the employment change in full' },
        { id:'purpose',      label:'Purpose of This Statement',   type:'text',     required:true,  placeholder:'e.g. UIF application, bank query' },
      ]},
    ],
  },

  fin_insurance: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Insurance Details', fields: [
        { id:'insurer',      label:'Insurance Company',           type:'text',     required:true },
        { id:'policyNum',    label:'Policy Number',               type:'text',     required:true },
        { id:'claimType',    label:'Type of Claim',               type:'text',     required:true,  placeholder:'e.g. Vehicle damage, household contents, building' },
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'itemsAffected',label:'Items / Property Affected',   type:'textarea', required:true },
        { id:'damageDesc',   label:'Description of Loss / Damage',type:'textarea', required:true },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'totalValue',   label:'Estimated Claim Value (R)',   type:'text',     required:false, keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage Cost (R)', type:'text', required:false, placeholder:'e.g. R 75 000', keyboard:'numeric' },
        { id:'circumstances',label:'Full Circumstances',          type:'textarea', required:true },
      ]},
    ],
  },

  // ── PERSONAL ──────────────────────────────────────────────────
  pers_address: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'address',     label:'Full Residential Address',     type:'textarea', required:true,  placeholder:'Street number, Street name, Suburb, City, Postal Code' },
        { id:'residingSince',label:'Residing at this address since', type:'date',  required:false },
        { id:'ownerOrTenant',label:'Status at address',           type:'picker',   required:true,  options:['Owner','Tenant','Family Member','Guest / Visitor'] },
        { id:'landlordName', label:'Landlord / Owner Name (if tenant)', type:'text', required:false },
        { id:'purpose',      label:'Purpose of Proof of Address', type:'text',     required:true,  placeholder:'e.g. FICA, bank account, SASSA application' },
      ]},
    ],
  },

  pers_residency: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'nationality', label:'Nationality',                  type:'text',     required:true },
        { id:'address',     label:'Current Address in South Africa', type:'textarea', required:true },
        { id:'status',      label:'Residency Status',             type:'picker',   required:true,  options:['Student','Tenant','Visitor','Permanent Resident','Work Permit Holder','Other'] },
        { id:'residingSince',label:'Residing at address since',   type:'date',     required:false },
        { id:'hostName',    label:'Host / Institution Name (if applicable)', type:'text', required:false },
        { id:'purpose',     label:'Purpose of Statement',         type:'text',     required:true,  placeholder:'e.g. Student registration, lease agreement, visa application' },
      ]},
    ],
  },

  pers_incident: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID / Passport Number',         type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'location',     label:'Location / Address',          type:'text',     required:true },
        { id:'incidentDesc', label:'Description of Incident',     type:'textarea', required:true,  placeholder:'Describe what happened in full detail, chronologically' },
        { id:'partiesInvolved', label:'Other Parties Involved',   type:'textarea', required:false, placeholder:'Names and details of any other people involved' },
        { id:'witnesses',    label:'Witnesses',                   type:'textarea', required:false },
        { id:'purpose',      label:'Purpose / Intended Recipient',type:'text',     required:true,  placeholder:'e.g. Insurance, school, employer, court' },
      ]},
    ],
  },

  pers_guardianship: {
    sections: [
      { title: 'Guardian Details', fields: [
        { id:'fullName',    label:'Guardian Full Name',           type:'text',     required:true },
        { id:'idNumber',    label:'Guardian ID Number',           type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: "Minor's Details", fields: [
        { id:'minorName',    label:"Minor's Full Name",          type:'text',     required:true },
        { id:'minorDob',     label:"Minor's Date of Birth",      type:'date',     required:true },
        { id:'minorId',      label:"Minor's ID Number (if issued)", type:'text',  required:false, keyboard:'phone-pad', maxLen:13 },
        { id:'relationship', label:'Your Relationship to the Minor', type:'picker', required:true, options:['Parent (Mother)','Parent (Father)','Legal Guardian','Grandparent','Aunt / Uncle','Other'] },
        { id:'guardianshipReason', label:'Reason for Guardianship Statement', type:'text', required:true, placeholder:'e.g. School enrolment, medical treatment, travel with minor' },
        { id:'otherParentInfo', label:'Other Parent / Guardian Details (if applicable)', type:'textarea', required:false, placeholder:'Name and contact details of other parent or legal guardian' },
        { id:'purpose',      label:'Purpose of Statement',        type:'text',     required:true,  placeholder:'e.g. School registration, passport application, travel consent' },
      ]},
    ],
  },

  pers_household: {
    sections: [
      { title: 'Head of Household', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'textarea', required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Household Details', fields: [
        { id:'numAdults',    label:'Number of Adults in Household', type:'text',   required:true,  keyboard:'numeric' },
        { id:'numChildren',  label:'Number of Children in Household', type:'text', required:true,  keyboard:'numeric' },
        { id:'householdMembers', label:'Household Members (names and ages)', type:'textarea', required:true, placeholder:'List each member: name, age, relationship' },
        { id:'monthlyIncome',label:'Combined Monthly Household Income (R)', type:'text', required:false, keyboard:'numeric' },
        { id:'circumstances',label:'Description of Household Circumstances', type:'textarea', required:true, placeholder:'Describe relevant household circumstances in full' },
        { id:'purpose',      label:'Purpose of Statement',        type:'text',     required:true,  placeholder:'e.g. SASSA, social worker, housing application' },
      ]},
    ],
  },

  // ── LEGAL ─────────────────────────────────────────────────────
  legal_witness: {
    sections: [
      { title: 'Witness Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'occupation',  label:'Occupation',                   type:'text',     required:false },
      ]},
      { title: 'Matter Details', fields: [
        { id:'caseRef',      label:'Case Reference / Number',     type:'text',     required:false },
        { id:'court',        label:'Court / SAPS Station',        type:'text',     required:false },
        { id:'relationship', label:'Your Relationship to the Matter', type:'picker', required:true, options:['Bystander / Witness','Victim','Accused','Expert Witness','Other'] },
      ]},
      { title: 'Witness Account', fields: [
        { id:'date',         label:'Date of Incident Witnessed',  type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'location',     label:'Location / Address',          type:'text',     required:true },
        { id:'witnessAccount', label:'Full Account of What You Witnessed', type:'textarea', required:true, placeholder:'Describe in full and in chronological order exactly what you witnessed. Be as specific and factual as possible.' },
        { id:'partiesInvolved', label:'Parties Involved',         type:'textarea', required:false, placeholder:'Names and descriptions of parties you witnessed' },
      ]},
    ],
  },

  legal_court_docs: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Case & Document Details', fields: [
        { id:'caseNum',      label:'Case Number (if known)',      type:'text',     required:false },
        { id:'courtName',    label:'Court Name and Location',     type:'text',     required:false },
        { id:'docsLost',     label:'Documents Lost',              type:'textarea', required:true,  placeholder:'Describe the documents that were lost' },
        { id:'dateLost',     label:'When Were the Documents Lost?', type:'date',   required:true },
        { id:'circumstances',label:'Circumstances of Loss',       type:'textarea', required:true },
        { id:'attorney',     label:'Attorney Name and Firm',      type:'text',     required:false },
      ]},
    ],
  },

  legal_sars: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'taxRef',      label:'Tax Reference Number',         type:'text',     required:true },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'SARS Matter Details', fields: [
        { id:'taxYear',      label:'Tax Year in Question',        type:'text',     required:true,  placeholder:'e.g. 2024/2025' },
        { id:'sarsType',     label:'Nature of SARS Matter',       type:'picker',   required:true,  options:['Lost IRP5 / Certificate','Unknown Bank Deposit','Income Discrepancy','Other Tax Declaration'] },
        { id:'employerName', label:'Employer Name (if IRP5-related)', type:'text', required:false },
        { id:'explanation',  label:'Full Explanation',            type:'textarea', required:true,  placeholder:'Describe the matter in full for SARS purposes' },
      ]},
    ],
  },

  legal_labour: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Employment & Labour Details', fields: [
        { id:'employerName', label:'Previous Employer Name',      type:'text',     required:true },
        { id:'employerAddr', label:'Employer Address',            type:'text',     required:true },
        { id:'startDate',    label:'Employment Start Date',       type:'date',     required:false },
        { id:'endDate',      label:'Employment End Date',         type:'date',     required:false },
        { id:'uifRef',       label:'UIF Reference Number (if known)', type:'text', required:false },
        { id:'docsLost',     label:'Documents / Records Lost',    type:'textarea', required:true,  placeholder:'Describe the employment records that are unavailable' },
        { id:'explanation',  label:'Full Explanation',            type:'textarea', required:true },
        { id:'purpose',      label:'Purpose of Statement',        type:'text',     required:true,  placeholder:'e.g. UIF claim, CCMA proceedings' },
      ]},
    ],
  },

  // ── OTHER ─────────────────────────────────────────────────────
  other_parcel: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Parcel Details', fields: [
        { id:'courier',      label:'Courier / Transport Company', type:'text',     required:true,  placeholder:'e.g. The Courier Guy, PostNet, DHL, Aramex' },
        { id:'trackingNum',  label:'Tracking / Reference Number', type:'text',     required:false },
        { id:'sentDate',     label:'Date Sent',                   type:'date',     required:false },
        { id:'expectedDate', label:'Expected Delivery Date',      type:'date',     required:false },
        { id:'parcelDesc',   label:'Contents of Parcel',          type:'textarea', required:true,  placeholder:'Describe all contents including estimated value of each item' },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'totalValue',   label:'Total Estimated Value (R)',   type:'text',     required:false, keyboard:'numeric' },
        { id:'estimatedDamage', label:'Estimated Total Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 3 500', keyboard:'numeric' },
        { id:'circumstances',label:'Circumstances of Loss',       type:'textarea', required:true,  placeholder:'When and how did you discover the parcel was lost or damaged?' },
      ]},
    ],
  },

  other_suspicious: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Your Address',                 type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Suspicious Activity', fields: [
        { id:'date',         label:'Date Observed',               type:'date',     required:true },
        { id:'time',         label:'Time Observed',               type:'time',     required:true },
        { id:'observedAt',   label:'Address / Location Observed', type:'text',     required:true },
        { id:'activityDesc', label:'Describe the Suspicious Activity', type:'textarea', required:true, placeholder:'What did you observe? Be specific about behaviours, vehicles, and persons.' },
        { id:'personDesc',   label:'Description of Suspicious Person(s)', type:'textarea', required:false, placeholder:'Physical description, clothing, approximate age, sex' },
        { id:'vehicleDesc',  label:'Vehicle Description (if any)',type:'text',     required:false, placeholder:'Make, model, colour, registration if observed' },
        { id:'priorReports', label:'Previously reported similar activity?', type:'ynu', required:false },
        { id:'caseNumber',   label:'SAPS Case Number (if reported)', type:'text',  required:false },
      ]},
    ],
  },

  other_workplace: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
        { id:'occupation',  label:'Occupation / Job Title',       type:'text',     required:true },
      ]},
      { title: 'Employer Details', fields: [
        { id:'employerName', label:'Employer Name',               type:'text',     required:true },
        { id:'workplaceAddr',label:'Workplace Address',           type:'text',     required:true },
        { id:'supervisorName',label:'Supervisor Name',            type:'text',     required:false },
        { id:'supervisorCell',label:'Supervisor Contact',         type:'text',     required:false, keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:true },
        { id:'incidentLocation', label:'Exact Location in Workplace', type:'text', required:true, placeholder:'e.g. Warehouse floor, reception area, machine room' },
        { id:'incidentDesc', label:'Full Description of Incident',type:'textarea', required:true,  placeholder:'Describe what happened in full chronological detail' },
        { id:'injuries',     label:'Injuries Sustained',         type:'textarea', required:false, placeholder:'Describe any injuries; write "None" if no injuries' },
        { id:'estimatedDamage', label:'Estimated Cost of Damages / Medical Treatment (R)', type:'text', required:false, placeholder:'e.g. R 8 000', keyboard:'numeric' },
        { id:'medicalTreatment', label:'Medical treatment received?', type:'ynu', required:false },
        { id:'witnessName',  label:'Witness Name',               type:'text',     required:false },
        { id:'witnessCell',  label:'Witness Contact',            type:'text',     required:false, keyboard:'phone-pad', maxLen:10 },
        { id:'reportedToEmployer', label:'Reported to employer?', type:'ynu',     required:false },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',   label:'SAPS Case Number (if applicable)', type:'text', required:false },
      ]},
    ],
  },

  other_animal: {
    sections: [
      { title: 'Your Details', fields: [
        { id:'fullName',    label:'Full Name',                    type:'text',     required:true },
        { id:'idNumber',    label:'ID Number',                    type:'text',     required:true,  keyboard:'phone-pad', maxLen:13 },
        { id:'address',     label:'Residential Address',          type:'text',     required:true },
        { id:'cell',        label:'Cell Number',                  type:'text',     required:true,  keyboard:'phone-pad', maxLen:10 },
      ]},
      { title: 'Incident Details', fields: [
        { id:'date',         label:'Date of Incident',            type:'date',     required:true },
        { id:'time',         label:'Approximate Time',            type:'time',     required:false },
        { id:'location',     label:'Location / Address',          type:'text',     required:true },
        { id:'animalType',   label:'Type of Animal',              type:'text',     required:true,  placeholder:'e.g. Dog, cat, snake, horse' },
        { id:'animalDesc',   label:'Animal Description',          type:'text',     required:false, placeholder:'Breed, colour, size' },
        { id:'ownerKnown',   label:'Is the animal owner known?',  type:'ynu',      required:true },
        { id:'ownerName',    label:'Owner Name (if known)',        type:'text',     required:false },
        { id:'ownerAddress', label:'Owner Address (if known)',     type:'text',     required:false },
        { id:'incidentType', label:'Nature of Incident',          type:'picker',   required:true,  options:['Animal Bite','Animal Attack (no bite)','Property Damage by Animal','Animal-related Vehicle Accident','Other'] },
        { id:'injuries',     label:'Injuries / Damage Sustained', type:'textarea', required:true,  placeholder:'Describe injuries or damage in full' },
        { id:'estimatedDamage', label:'Estimated Cost of Damages / Medical Treatment (R)', type:'text', required:false, placeholder:'e.g. R 4 500', keyboard:'numeric' },
        { id:'medicalTreatment', label:'Medical treatment received?', type:'ynu', required:false },
        { id:'hospital',     label:'Hospital / Clinic (if treated)', type:'text',  required:false },
        { id:'circumstances',label:'Full Circumstances',          type:'textarea', required:true },
        { id:'estimatedDamage', label:'Estimated Damage / Loss (R)', type:'text', required:false, placeholder:'e.g. R 15 000', keyboard:'numeric' },
        { id:'caseNumber',   label:'SAPS Case Number',            type:'text',     required:false },
      ]},
    ],
  },
};



// ─────────────────────────────────────────────────────────────────
// GENERIC CONSENT SCREEN (non-vehicle statement types)
// ─────────────────────────────────────────────────────────────────
function GenericConsentScreen({ navigation, route }) {
  const { draft, statementType, category } = route.params;
  const [consentData, setConsentData] = useState(false);
  const accentCol = category?.colour || C.red;

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar
        title={statementType?.label || 'Statement'}
        subtitle="AffidavitAssist"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={{ flex:1 }} contentContainerStyle={ui.body}>
        <Text style={ui.heading}>{statementType?.label}</Text>
        <Text style={{ fontSize:15, color:C.grey, lineHeight:22, marginBottom:18 }}>
          We will guide you step by step through creating a complete and accurate affidavit. Please read and accept the consent below to continue.
        </Text>
        <InfoBox icon="📋">{getStatementSplashInfo(statementType?.id)?.needs?.join(' · ')}</InfoBox>
        <Text style={ui.secLbl}>CONSENT</Text>
        <CheckRow
          label="I consent to the processing of my personal data to generate an affidavit statement."
          sublabel="Required — this must be checked to continue"
          checked={consentData}
          onChange={setConsentData}
        />
        <Disclaimer />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn
          label="Continue →"
          color={accentCol}
          onPress={() => {
            if (!consentData) return Alert.alert('Required', 'Please tick the required consent checkbox.');
            navigation.navigate('GenericForm', { draft });
          }}
          disabled={!consentData}
        />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// GENERIC FORM SCREEN — works for all non-vehicle statement types
// Renders sections + fields from GENERIC_FLOWS[typeId]
// ─────────────────────────────────────────────────────────────────
function GenericFormScreen({ navigation, route }) {
  const { draft } = route.params;
  const typeId    = draft.statementTypeId;
  const flow      = GENERIC_FLOWS[typeId];
  const typeInfo  = AFFIDAVIT_TYPE_MAP[typeId] || {};

  const totalSections = flow ? flow.sections.length : 0;
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers]       = useState(draft.genericAnswers || {});
  const [showPicker, setShowPicker] = useState(null); // { fieldId, options }
  const [showDate, setShowDate]     = useState(null); // fieldId
  const [showTime, setShowTime]     = useState(null); // fieldId

  if (!flow) {
    return (
      <SafeAreaView style={ui.safe} edges={['bottom']}>
        <TopBar title="Statement Form" subtitle="AffidavitAssist" onBack={() => navigation.goBack()} />
        <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:32 }}>
          <Text style={{ fontSize:40, marginBottom:16 }}>🚧</Text>
          <Text style={{ fontSize:18, fontWeight:'800', color:C.red, marginBottom:8, textAlign:'center' }}>Coming Soon</Text>
          <Text style={{ fontSize:14, color:C.grey, textAlign:'center', lineHeight:21 }}>
            The guided question flow for this statement type is being prepared. Please check back in the next update.
          </Text>
          <View style={{ marginTop:24, width:'100%' }}>
            <Btn label="← Go Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const section   = flow.sections[sectionIdx];
  const setAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const validateSection = () => {
    for (const f of section.fields) {
      if (f.required && !answers[f.id]?.toString().trim()) {
        Alert.alert('Required Field', `Please fill in: ${f.label}`);
        return false;
      }
      if (f.keyboard === 'phone-pad' && f.maxLen === 10 && answers[f.id] && !/^\d{10}$/.test(answers[f.id])) {
        Alert.alert('Invalid Number', `${f.label} must be exactly 10 digits.`);
        return false;
      }
      if (f.keyboard === 'phone-pad' && f.maxLen === 13 && answers[f.id] && !/^\d{13}$/.test(answers[f.id])) {
        Alert.alert('Invalid ID Number', `${f.label} must be exactly 13 digits.`);
        return false;
      }
    }
    return true;
  };

  const next = async () => {
    if (!validateSection()) return;
    if (sectionIdx < totalSections - 1) {
      setSectionIdx(s => s + 1);
    } else {
      const updated = { ...draft, genericAnswers: answers };
      const stText  = buildGenericStatement(updated);
      const final   = { ...updated, statementText: stText, status: 'Complete' };
      await saveDraft(final);
      // Fire "completed" email — non-blocking
      sendEmail(buildEmailParams(final, 'completed')).catch(() => {});
      navigation.navigate('GenericPreview', { draft: final });
    }
  };

  const prev = () => {
    if (sectionIdx > 0) setSectionIdx(s => s - 1);
    else navigation.goBack();
  };

  const formatDateDisplay = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar
        title={typeInfo.label || 'Statement'}
        subtitle={`Section ${sectionIdx + 1} of ${totalSections}`}
        onBack={prev}
      />
      <ProgressBar step={sectionIdx + 1} total={totalSections} label={`${section.title} — ${sectionIdx + 1} / ${totalSections}`} />

      <ScrollView style={{ flex:1 }} contentContainerStyle={ui.body} keyboardShouldPersistTaps="handled">
        <SectionHead>{section.title}</SectionHead>

        {section.fields.map(f => {
          const val = answers[f.id] || '';
          const isPhone = f.keyboard === 'phone-pad' && f.maxLen === 10;
          const isID    = f.keyboard === 'phone-pad' && f.maxLen === 13;
          const phoneErr = isPhone && val && val.length !== 10 ? 'Must be exactly 10 digits' : null;
          const idErr    = isID    && val && val.length === 13 && !isValidID(val) ? 'Invalid ID number — check digit incorrect' : isID && val && val.length !== 13 ? 'Must be exactly 13 digits' : null;

          if (f.type === 'ynu') return (
            <View key={f.id} style={[ui.subCard, { marginBottom: 14 }]}>
              <Text style={ui.subTxt}>{f.label}{f.required ? <Text style={{ color:C.yellow }}> *</Text> : null}</Text>
              <YNU value={val} onChange={v => setAnswer(f.id, v)} />
            </View>
          );

          if (f.type === 'date') return (
            <Field key={f.id} label={f.label} required={f.required}>
              <PickBtn
                value={val ? formatDateDisplay(val) : ''}
                placeholder="Select date"
                onPress={() => setShowDate(f.id)}
              />
            </Field>
          );

          if (f.type === 'time') return (
            <Field key={f.id} label={f.label} required={f.required}>
              <PickBtn
                value={val}
                placeholder="Select time"
                onPress={() => setShowTime(f.id)}
              />
            </Field>
          );

          if (f.type === 'picker') {
            const opts = f.options === 'PROVINCES' ? PROVINCES : f.options;
            return (
              <Field key={f.id} label={f.label} required={f.required}>
                <PickBtn
                  value={val}
                  placeholder="Select..."
                  onPress={() => setShowPicker({ fieldId: f.id, options: opts })}
                />
              </Field>
            );
          }

          // text / textarea
          return (
            <Field key={f.id} label={f.label} required={f.required}>
              <Inp
                placeholder={f.placeholder || ''}
                value={val}
                onChangeText={v => {
                  let clean = v;
                  if (f.keyboard === 'phone-pad') clean = digitsOnly(v).slice(0, f.maxLen || 99);
                  setAnswer(f.id, clean);
                }}
                keyboardType={f.keyboard || 'default'}
                multiline={f.type === 'textarea'}
                numberOfLines={f.type === 'textarea' ? 4 : 1}
                error={phoneErr || idErr}
              />
            </Field>
          );
        })}
      </ScrollView>

      <BottomBar>
        <BtnGhost label={sectionIdx === 0 ? '← Back' : '← Previous'} onPress={prev} />
        <Btn
          label={sectionIdx < totalSections - 1 ? 'Next →' : '📄 Generate Statement'}
          color={sectionIdx < totalSections - 1 ? C.red : C.yellow}
          onPress={next}
        />
      </BottomBar>

      {/* Pickers */}
      {showPicker && (
        <ListPicker
          visible={true}
          title={showPicker.fieldId}
          options={showPicker.options}
          onSelect={v => { setAnswer(showPicker.fieldId, v); setShowPicker(null); }}
          onClose={() => setShowPicker(null)}
        />
      )}
      <DatePickerModal
        visible={!!showDate}
        value={showDate ? (answers[showDate] || '') : ''}
        onChange={v => { if (showDate) setAnswer(showDate, v); }}
        onClose={() => setShowDate(null)}
      />
      <TimePickerModal
        visible={!!showTime}
        value={showTime ? (answers[showTime] || '') : ''}
        onChange={v => { if (showTime) setAnswer(showTime, v); }}
        onClose={() => setShowTime(null)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// GENERIC PREVIEW SCREEN
// ─────────────────────────────────────────────────────────────────
function GenericPreviewScreen({ navigation, route }) {
  const { draft } = route.params;
  const [busy, setBusy] = useState(false);
  const typeInfo = AFFIDAVIT_TYPE_MAP[draft.statementTypeId] || {};

  const buildHtml = () => {
    const disclaimerText = 'This statement was generated using the AffidavitAssist tool, a free service provided by MyLawSA. The accuracy, completeness, and truthfulness of the contents of this statement are the sole responsibility of the person who provided the information. MyLawSA, its directors, employees, and agents accept no liability whatsoever for any inaccurate, false, or misleading information contained herein. This document does not constitute legal advice.';
    return `<html><body style="font-family:monospace;padding:32px;font-size:13px;line-height:1.6;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;">
        <img src="${LOGO_B64}" style="width:60px;height:60px;object-fit:contain;" />
        <div>
          <h2 style="font-family:sans-serif;color:#C62828;margin:0 0 2px;">AffidavitAssist</h2>
          <p style="font-family:sans-serif;color:#888;margin:0;font-size:11px;letter-spacing:1px;">${typeInfo.categoryLabel || ''} · ${typeInfo.label || ''}</p>
          <p style="font-family:sans-serif;color:#aaa;margin:0;font-size:10px;letter-spacing:1px;">A FREE SERVICE BY MYLAWSA</p>
        </div>
      </div>
      <hr style="border:none;border-top:2px solid #C62828;margin-bottom:24px;"/>
      <pre style="white-space:pre-wrap;font-family:monospace;font-size:13px;line-height:1.7;">${draft.statementText}</pre>
      <hr style="border:none;border-top:1px solid #ddd;margin-top:48px;margin-bottom:12px;"/>
      <p style="font-family:sans-serif;font-size:9px;color:#aaa;line-height:1.6;font-style:italic;text-align:center;">${disclaimerText}</p>
    </body></html>`;
  };

  const handleShare = async () => {
    try {
      setBusy(true);
      const { uri } = await Print.printToFileAsync({ html: buildHtml() });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share your statement' });
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setBusy(false); }
  };

  const handlePrint = async () => {
    try { await Print.printAsync({ html: buildHtml() }); }
    catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Statement Preview" subtitle="AffidavitAssist" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex:1 }} contentContainerStyle={ui.body}>
        <Disclaimer />
        {/* Statement text */}
        <View style={{ backgroundColor:'white', borderRadius:14, borderWidth:1.5, borderColor:C.border, overflow:'hidden', marginBottom:16 }}>
          <View style={{ backgroundColor: typeInfo.categoryColour || C.red, paddingVertical:14, paddingHorizontal:20 }}>
            <Text style={{ color:'white', fontSize:13, fontWeight:'700', letterSpacing:1.5, textAlign:'center' }}>
              {(typeInfo.label || 'AFFIDAVIT').toUpperCase()}
            </Text>
          </View>
          <Text style={{ padding:20, fontSize:13, color:C.text, lineHeight:20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
            {draft.statementText}
          </Text>
        </View>
        {/* Export buttons */}
        <View style={{ gap:10 }}>
          <TouchableOpacity
            style={{ backgroundColor: typeInfo.categoryColour || C.red, borderRadius:14, paddingVertical:16, alignItems:'center', flexDirection:'row', justifyContent:'center', gap:10 }}
            onPress={handleShare} activeOpacity={0.85} disabled={busy}>
            <Text style={{ color:'white', fontSize:15, fontWeight:'700' }}>{busy ? '⏳ Generating PDF...' : '📤 Share PDF'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor:'white', borderRadius:14, paddingVertical:16, alignItems:'center', borderWidth:1.5, borderColor:C.border, flexDirection:'row', justifyContent:'center', gap:10 }}
            onPress={handlePrint} activeOpacity={0.85}>
            <Text style={{ color:C.text, fontSize:15, fontWeight:'700' }}>🖨️ Print Statement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Edit" onPress={() => navigation.goBack()} />
        <Btn label="Done ✓" onPress={() => {
              Alert.alert('Statement Complete', 'Your statement has been saved. A notification has been sent to the MyLawSA team.', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
            }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// GENERIC STATEMENT BUILDER
// Converts GENERIC_FLOWS answers into a formatted statement string
// ─────────────────────────────────────────────────────────────────
function buildGenericStatement(draft) {
  const typeId   = draft.statementTypeId;
  const typeInfo = AFFIDAVIT_TYPE_MAP[typeId] || {};
  const flow     = GENERIC_FLOWS[typeId];
  const answers  = draft.genericAnswers || {};
  const line     = '─'.repeat(40);
  const gph      = (id, fb) => (answers[id] && String(answers[id]).trim()) ? String(answers[id]).trim() : `[${fb || id.toUpperCase()}]`;
  const yn       = (id) => answers[id] === 'y' ? 'Yes' : answers[id] === 'n' ? 'No' : answers[id] === 'u' ? 'Unknown' : '[Not specified]';
  const fmtDate  = (id) => {
    if (!answers[id]) return '[DATE]';
    const d = new Date(answers[id]);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  let s = `AFFIDAVIT\n`;
  s += `${typeInfo.categoryLabel ? typeInfo.categoryLabel.toUpperCase() + ' — ' : ''}${(typeInfo.label || typeId).toUpperCase()}\n`;
  s += `${line}\n\n`;
  s += `I, ${gph('fullName','FULL NAME')}, Identity / Passport Number: ${gph('idNumber','ID NUMBER')}, `;
  s += `do hereby make oath and state the following:\n\n`;

  if (!flow) return s + '[Statement content unavailable — please complete manually]\n';

  flow.sections.forEach((sec, si) => {
    s += `${line}\n${si + 1}. ${sec.title.toUpperCase()}\n${line}\n`;
    sec.fields.forEach(f => {
      if (f.id === 'fullName' || f.id === 'idNumber') return; // already in header
      let val = '';
      if (f.type === 'date')   val = fmtDate(f.id);
      else if (f.type === 'ynu') val = yn(f.id);
      else val = answers[f.id] ? String(answers[f.id]).trim() : '[Not provided]';
      if (f.id === 'estimatedDamage' && val && val !== '[Not provided]') {
        const cleaned = val.replace(/^R\s*/i, '');
        s += `${f.label}: R ${cleaned}\n`;
      } else if (val && val !== '[Not provided]') s += `${f.label}: ${val}\n`;
    });
    s += `\n`;
  });

  s += `${line}\nDECLARATION\n${line}\n`;
  s += `I declare that the contents of this affidavit are true and correct to the best of my knowledge and belief.\n`;
  s += `I know and understand the contents of this declaration.\n`;
  s += `I have no objection to taking the prescribed oath.\n`;
  s += `I consider the prescribed oath to be binding on my conscience.\n\n`;
  s += `Signed at ___________________________ on this _____ day of _________________ 20_____\n\n`;
  s += `Signature: __________________________\n\n`;
  s += `Full Name: ${gph('fullName','FULL NAME')}\n\n`;
  s += `Before me:\n\n`;
  s += `Commissioner of Oaths: __________________________\n\n`;
  s += `Designation: __________________________\n\n`;
  s += `Date: __________________________\n`;

  return s;
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 1 — SPLASH (Vehicle Accident — existing flow)
// ─────────────────────────────────────────────────────────────────
function SplashScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.red }}>
      <StatusBar barStyle="light-content" backgroundColor={C.red} />
      {/* SA flag stripe layout */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%', backgroundColor: C.green }} />
      <View style={{ position: 'absolute', bottom: '34%', left: 0, right: 0, height: '5%', backgroundColor: C.yellow }} />

      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ position: 'absolute', top: 52, left: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24 }}>‹</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Categories</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 28, alignItems: 'center' }}>
          <Image source={{ uri: LOGO_B64 }} style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: 'white' }} resizeMode="contain" />
          <Text style={sp.title}>SAPS{'\n'}<Text style={{ color: C.yellow }}>Accident</Text>{'\n'}Statement</Text>
          <Text style={sp.sub}>From incident to accident statement — made easy. Create a clear, accurate SAPS accident statement step by step.</Text>
          <View style={{ flex: 1 }} />
          <Text style={sp.tagline}>A FREE SERVICE BY MYLAWSA</Text>
          <TouchableOpacity style={sp.btnPrimary} onPress={() => navigation.navigate('Welcome')} activeOpacity={0.85}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>Get Started →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sp.btnOutline} onPress={() => navigation.navigate('Reports')} activeOpacity={0.85}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600' }}>I Have an Existing Draft</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 15 }}>
            This statement has been generated based solely on information provided by the individual. The accuracy, completeness, and truthfulness of the contents remain the full responsibility of the person who supplied the information.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
const sp = StyleSheet.create({
  logo:      { width: 84, height: 84, backgroundColor: 'white', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10 },
  title:     { fontSize: 44, fontWeight: '800', color: 'white', textAlign: 'center', letterSpacing: -1, lineHeight: 50, marginBottom: 16 },
  sub:       { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 21 },
  tagline:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 },
  btnPrimary:{ width: '100%', backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginBottom: 12, shadowColor: C.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  btnOutline:{ width: '100%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
});

// ─────────────────────────────────────────────────────────────────
// SCREEN 2 — WELCOME & CONSENT
// ─────────────────────────────────────────────────────────────────
function WelcomeScreen({ navigation }) {
  const [consentData, setConsentData] = useState(false);
  const [consentMkt,  setConsentMkt]  = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Welcome" subtitle="AffidavitAssist" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Text style={ui.heading}>Welcome</Text>
        <Text style={{ fontSize: 15, color: C.grey, lineHeight: 22, marginBottom: 18 }}>From incident to accident statement — made easy. Create clear, accurate accident statements with our simple step-by-step guidance.</Text>
        <InfoBox icon="📋">Your ID or passport, vehicle registration details, and as much information as possible about the accident and other parties involved.</InfoBox>
        <Text style={ui.secLbl}>CONSENT</Text>
        <CheckRow label="I consent to the processing of my personal data to generate an accident statement." sublabel="Required — this must be checked to continue" checked={consentData} onChange={setConsentData} />
        <CheckRow label="MyLawSA may contact me regarding legal assistance with my claim." sublabel="Optional — we can help you recover vehicle damage at no upfront cost" checked={consentMkt} onChange={setConsentMkt} />
        <Disclaimer />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Continue →" onPress={async () => {
          if (!consentData) return Alert.alert('Required', 'Please tick the required consent checkbox.');
          // Save marketing consent into AsyncStorage so it can be read later
          // We use a temp key that GenerateScreen will pick up
          try { await AsyncStorage.setItem('pending_mkt_consent', consentMkt ? '1' : '0'); } catch {}
          navigation.navigate('Reports');
        }} disabled={!consentData} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 3 — REPORTS OVERVIEW
// ─────────────────────────────────────────────────────────────────
function ReportsScreen({ navigation }) {
  const [drafts, setDrafts] = useState([]);
  useFocusEffect(useCallback(() => { loadDrafts().then(setDrafts); }, []));

  const STATUS = {
    'In Progress': { bg: C.yellowLight, txt: C.yellow2, border: '#FFD54F' },
    'Complete':    { bg: C.greenLight,  txt: C.green,   border: '#81C784' },
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="My Reports" subtitle="AffidavitAssist" onBack={() => navigation.navigate('Home')} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <TouchableOpacity style={ui.newBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
          <Text style={{ color: C.yellow, fontSize: 22, fontWeight: '800' }}>+</Text>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', flex: 1 }}>Create New Statement</Text>
        </TouchableOpacity>

        {drafts.length === 0
          ? <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ fontSize: 52, marginBottom: 14 }}>📋</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.red, marginBottom: 6 }}>No reports yet</Text>
              <Text style={{ fontSize: 14, color: C.grey, textAlign: 'center', lineHeight: 20 }}>Tap the button above to create your first accident statement.</Text>
            </View>
          : <>
              <Text style={ui.secLbl}>EXISTING DRAFTS</Text>
              {drafts.map(d => {
                const ss = STATUS[d.status] || STATUS['In Progress'];
                const cr = new Date(d.createdAt);
                return (
                  <TouchableOpacity key={d.id} style={ui.draftCard} activeOpacity={0.75}
                    onPress={() => navigation.navigate(d.status === 'Complete' ? 'Preview' : 'Details', { draft: d })}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: C.red }}>Report # {d.reportNumber}</Text>
                        {d.statementTypeId && d.statementTypeId !== 'vehicle_accident' && (
                          <Text style={{ fontSize: 11, color: C.grey, marginTop: 1 }}>
                            {AFFIDAVIT_TYPE_MAP[d.statementTypeId]?.label || d.statementTypeId}
                          </Text>
                        )}
                        <Text style={{ fontSize: 12, color: C.grey, marginTop: 2 }}>
                          Created: {cr.getDate()} {MONTHS[cr.getMonth()].slice(0,3)} {cr.getFullYear()} · {String(cr.getHours()).padStart(2,'0')}:{String(cr.getMinutes()).padStart(2,'0')}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => Alert.alert('Delete Draft', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDraft(d.id); loadDrafts().then(setDrafts); } }])}>
                        <Text style={{ color: C.grey, fontSize: 18, padding: 4 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[ui.statusBadge, { backgroundColor: ss.bg, borderColor: ss.border }]}>
                      <Text style={[ui.statusTxt, { color: ss.txt }]}>{d.status}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREENS 4–6 — DETAILS (Driver / Vehicle / Accident tabs)
// ─────────────────────────────────────────────────────────────────
function DetailsScreen({ navigation, route }) {
  const [draft, setDraft]   = useState(route.params.draft);
  const [tab,   setTab]     = useState(0);
  const [showRel,   setRel] = useState(false);
  const [showProv, setProv] = useState(false);
  const [showDate, setDate] = useState(false);
  const [showTime, setTime] = useState(false);

  const ud = (f, v) => setDraft(d => ({ ...d, driver:   { ...d.driver,   [f]: v } }));
  const uv = (f, v) => setDraft(d => ({ ...d, vehicle:  { ...d.vehicle,  [f]: v } }));
  const ua = (f, v) => setDraft(d => ({ ...d, accident: { ...d.accident, [f]: v } }));

  const labels = ['Step 1 of 6 · Driver', 'Step 2 of 6 · Vehicle', 'Step 3 of 6 · Accident'];

  const next = async () => {
    if (tab === 0) {
      if (!draft.driver.fullName || !draft.driver.cellOrEmail || !draft.driver.idNumber || !draft.driver.relationship)
        return Alert.alert('Required Fields', 'Please fill in all required fields marked with *.');
      if (!isValidCell(draft.driver.cellOrEmail))
        return Alert.alert('Invalid Cell Number', 'Cell number must be exactly 10 digits and contain only numbers.');
      if (!isValidID(draft.driver.idNumber))
        return Alert.alert('Invalid ID Number', draft.driver.idNumber.length !== 13
          ? 'ID number must be exactly 13 digits.'
          : 'The ID number entered is not valid. Please check the number and try again. The last digit is a mathematically derived check digit.');
      setTab(1);
    } else if (tab === 1) {
      if (!draft.vehicle.registration) return Alert.alert('Required Fields', 'Please enter your vehicle registration number.');
      setTab(2);
    } else {
      if (!draft.accident.date || !draft.accident.time || !draft.accident.street || !draft.accident.city)
        return Alert.alert('Required Fields', 'Please fill in all required fields marked with *.');
      if (!isNotFuture(draft.accident.date))
        return Alert.alert('Invalid Date', 'The accident date cannot be a future date.');
      await saveDraft(draft);
      navigation.navigate('Classifier', { draft });
    }
  };

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Accident Details" subtitle="AffidavitAssist" onBack={() => tab > 0 ? setTab(tab - 1) : navigation.goBack()} />
      <ProgressBar step={tab + 1} total={6} label={labels[tab]} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body} keyboardShouldPersistTaps="handled">
        <Tabs tabs={['Driver', 'Vehicle', 'Accident']} active={tab} onPress={i => { if (i < tab) setTab(i); }} />

        {tab === 0 && <>
          <Field label="Full Name" required><Inp placeholder="e.g. John Dlamini" value={draft.driver.fullName} onChangeText={v => ud('fullName', v)} /></Field>
          <Field label="Cell Number" required>
            <Inp
              placeholder="e.g. 0821234567"
              value={draft.driver.cellOrEmail}
              onChangeText={v => ud('cellOrEmail', digitsOnly(v).slice(0, 10))}
              keyboardType="phone-pad"
              error={draft.driver.cellOrEmail && !isValidCell(draft.driver.cellOrEmail) ? 'Must be exactly 10 digits' : null}
            />
          </Field>
          <Field label="ID Number" required>
            <Inp
              placeholder="13-digit South African ID number"
              value={draft.driver.idNumber}
              onChangeText={v => ud('idNumber', digitsOnly(v).slice(0, 13))}
              keyboardType="phone-pad"
              error={draft.driver.idNumber && !isValidID(draft.driver.idNumber) ? (draft.driver.idNumber.length !== 13 ? 'Must be exactly 13 digits' : 'Invalid ID number — check digit incorrect') : null}
            />
          </Field>
          <Field label="Residential Address"><Inp placeholder="Street, Suburb, City" value={draft.driver.address} onChangeText={v => ud('address', v)} /></Field>
          <Field label="Driver's Licence Number"><Inp placeholder="Licence number" value={draft.driver.licenceNumber} onChangeText={v => ud('licenceNumber', v)} /></Field>
          <Field label="Relationship to Vehicle" required><PickBtn value={draft.driver.relationship} placeholder="Select..." onPress={() => setRel(true)} /></Field>
        </>}

        {tab === 1 && <>
          <Field label="Registration Number" required><Inp placeholder="e.g. GP 123-456" value={draft.vehicle.registration} onChangeText={v => uv('registration', v)} /></Field>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Make" style={{ flex: 1 }}><Inp placeholder="e.g. Toyota" value={draft.vehicle.make} onChangeText={v => uv('make', v)} /></Field>
            <Field label="Model" style={{ flex: 1 }}><Inp placeholder="e.g. Corolla" value={draft.vehicle.model} onChangeText={v => uv('model', v)} /></Field>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Year" style={{ flex: 1 }}><Inp placeholder="e.g. 2019" value={draft.vehicle.year} onChangeText={v => uv('year', v)} keyboardType="numeric" /></Field>
            <Field label="Colour" style={{ flex: 1 }}><Inp placeholder="e.g. Silver" value={draft.vehicle.colour} onChangeText={v => uv('colour', v)} /></Field>
          </View>
          <CheckRow label="Trailer involved?" checked={draft.vehicle.trailerInvolved} onChange={v => uv('trailerInvolved', v)} />
          {draft.vehicle.trailerInvolved && <Field label="Trailer Registration" style={{ marginTop: 10 }}><Inp placeholder="Trailer registration number" value={draft.vehicle.trailerReg} onChangeText={v => uv('trailerReg', v)} /></Field>}
        </>}

        {tab === 2 && <>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field label="Date" required style={{ flex: 1 }}>
              <PickBtn value={draft.accident.date ? (() => { const d = new Date(draft.accident.date); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`; })() : ''} placeholder="Select date" onPress={() => setDate(true)} />
            </Field>
            <Field label="Time" required style={{ flex: 1 }}>
              <PickBtn value={draft.accident.time} placeholder="Select time" onPress={() => setTime(true)} />
            </Field>
          </View>
          <Field label="Street / Road" required><Inp placeholder="e.g. Commissioner Street, Johannesburg" value={draft.accident.street} onChangeText={v => ua('street', v)} /></Field>
          <Field label="Nearest Landmark or Intersection"><Inp placeholder="e.g. Near KFC / Corner of Main Road" value={draft.accident.landmark} onChangeText={v => ua('landmark', v)} /></Field>
          <Field label="City / Town" required><Inp placeholder="e.g. Johannesburg" value={draft.accident.city} onChangeText={v => ua('city', v)} /></Field>
          <Field label="Province"><PickBtn value={draft.accident.province} placeholder="Select province..." onPress={() => setProv(true)} /></Field>
          <Field label="Estimated Vehicle Damage (R)"><Inp placeholder="e.g. R 35 000" value={draft.accident.estimatedDamage} onChangeText={v => ua('estimatedDamage', v)} keyboardType="numeric" /></Field>
          <Field label="SAPS Case Number (if known)"><Inp placeholder="e.g. CAS 123/02/2025" value={draft.accident.caseNumber} onChangeText={v => ua('caseNumber', v)} /></Field>
        </>}
      </ScrollView>

      <BottomBar>
        {tab > 0 && <BtnGhost label="← Previous" onPress={() => setTab(tab - 1)} />}
        <Btn label={tab < 2 ? 'Next Section →' : 'Next →'} onPress={next} />
      </BottomBar>

      <ListPicker visible={showRel}  title="Relationship to Vehicle" options={RELATIONSHIPS} onSelect={v => ud('relationship', v)} onClose={() => setRel(false)}  />
      <ListPicker visible={showProv} title="Province"               options={PROVINCES}     onSelect={v => ua('province', v)}     onClose={() => setProv(false)} />
      <DatePickerModal visible={showDate} value={draft.accident.date}  onChange={v => ua('date', v)} onClose={() => setDate(false)} />
      <TimePickerModal visible={showTime} value={draft.accident.time}  onChange={v => ua('time', v)} onClose={() => setTime(false)} />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 7 — CLASSIFIER (Q1–Q15)
// ─────────────────────────────────────────────────────────────────
function ClassifierScreen({ navigation, route }) {
  const [draft,   setDraft]   = useState(route.params.draft);
  const [curId,   setCurId]   = useState(1);
  const [history, setHistory] = useState([]);
  const q = QUESTIONS.find(x => x.id === curId);

  const answer = (yes) => {
    if (!q) return;
    const result  = yes ? q.yes : q.no;
    const updated = { ...draft, classifierAnswers: { ...draft.classifierAnswers, [curId]: yes ? 'y' : 'n' } };
    setDraft(updated);
    setHistory(h => [...h, curId]);
    if (typeof result === 'number') { setCurId(result); }
    else { navigation.navigate('Outcome', { draft: { ...updated, accidentKey: result } }); }
  };

  const back = () => {
    if (history.length > 0) { setCurId(history[history.length - 1]); setHistory(h => h.slice(0, -1)); }
    else navigation.goBack();
  };

  if (!q) return null;
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Classify Accident" subtitle={`Question ${curId} of ${QUESTIONS.length}`} onBack={back} />
      <ProgressBar step={curId} total={QUESTIONS.length} label={`Q${curId} / ${QUESTIONS.length}`} />
      <View style={{ flex: 1, padding: 24 }}>
        <View style={cl.card}>
          <View style={cl.badge}><Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>Q{curId}</Text></View>
          <Text style={cl.qTxt}>{q.text}</Text>
          {q.hint ? <Text style={cl.hint}>{q.hint}</Text> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20 }}>
          <TouchableOpacity style={[cl.ansBtn, { backgroundColor: C.greyLight, borderWidth: 1.5, borderColor: C.border }]} onPress={() => answer(false)} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.grey }}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cl.ansBtn, { backgroundColor: C.green, shadowColor: C.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }]} onPress={() => answer(true)} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>Yes</Text>
          </TouchableOpacity>
        </View>
        <InfoBox>Answer each question honestly. The more accurate your answers, the better your statement will be.</InfoBox>
      </View>
    </SafeAreaView>
  );
}
const cl = StyleSheet.create({
  card:  { backgroundColor: 'white', borderRadius: 16, borderWidth: 1.5, borderColor: C.border, padding: 24, marginBottom: 24, shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  badge: { backgroundColor: C.red, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 14 },
  qTxt:  { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.3, lineHeight: 28, marginBottom: 8 },
  hint:  { fontSize: 13, color: C.grey, lineHeight: 18, fontStyle: 'italic' },
  ansBtn:{ flex: 1, paddingVertical: 24, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

// ─────────────────────────────────────────────────────────────────
// SCREENS 8A–8M — OUTCOME + FOLLOW-UPS
// ─────────────────────────────────────────────────────────────────
function OutcomeScreen({ navigation, route }) {
  const [draft, setDraft]   = useState(route.params.draft);
  const [sub,   setSub]     = useState(route.params.draft.subAnswers || {});
  const outcome = OUTCOMES[draft.accidentKey] || OUTCOMES.NOT_CLASSIFIABLE;
  const set = (id, val) => setSub(s => ({ ...s, [id]: val }));

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Accident Classified" subtitle="Answer follow-up questions" onBack={() => navigation.goBack()} />
      <ProgressBar step={4} total={6} label="Step 4 of 6 · Accident Type" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Banner
          claimable={outcome.claimable} label={outcome.label}
          description={outcome.claimable ? 'This accident type may be claimable against the at-fault driver. MyLawSA can assist you with recovery at no upfront cost.' : 'This incident type is generally not insurable or claimable against a third party.'}
        />
        {outcome.subQs?.length > 0 && <>
          <View style={ui.card}>
            <Text style={ui.cardTitle}>Follow-up Questions</Text>
            <Text style={{ fontSize: 13, color: C.grey, lineHeight: 18 }}>Please answer the questions below to complete your accident classification.</Text>
          </View>
          {outcome.subQs.map(sq => {
            if (sq.conditionalOn && sub[sq.conditionalOn] !== 'y') return null;
            return (
              <View key={sq.id} style={ui.subCard}>
                <Text style={ui.subTxt}>{sq.label}</Text>
                {sq.type === 'ynu' && <YNU value={sub[sq.id]} onChange={v => set(sq.id, v)} />}
                {(sq.type === 'text' || sq.type === 'textarea') && <Inp placeholder={sq.placeholder} value={sub[sq.id] || ''} onChangeText={v => set(sq.id, v)} multiline={sq.type === 'textarea'} numberOfLines={sq.type === 'textarea' ? 4 : 1} style={{ marginTop: 8 }} />}
              </View>
            );
          })}
        </>}
        {outcome.key === 'NOT_CLASSIFIABLE' && <InfoBox>The accident could not be matched to a known type. The statement may still be generated using the general template, but a NOMS recovery claim may not be possible.</InfoBox>}
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Next: Other Parties →" onPress={async () => { const u = { ...draft, subAnswers: sub }; await saveDraft(u); navigation.navigate('OtherParties', { draft: u }); }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 9 — OTHER PARTIES
// ─────────────────────────────────────────────────────────────────
function OtherPartiesScreen({ navigation, route }) {
  const [draft, setDraft] = useState({ ...route.params.draft, otherParties: route.params.draft.otherParties?.length > 0 ? route.params.draft.otherParties : [{}], witnesses: route.params.draft.witnesses || [] });

  const updP = (i, val) => setDraft(d => { const p = [...d.otherParties]; p[i] = val; return { ...d, otherParties: p }; });
  const updW = (i, val) => setDraft(d => { const w = [...d.witnesses];    w[i] = val; return { ...d, witnesses:    w }; });

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Other Parties" subtitle="Drivers & Witnesses" onBack={() => navigation.goBack()} />
      <ProgressBar step={5} total={6} label="Step 5 of 6 · Other Parties" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <InfoBox icon="💡">The more details you provide about the other parties involved, the more complete and useful your statement will be.</InfoBox>
        <SectionHead>Other Driver(s)</SectionHead>
        {draft.otherParties.map((p, i) => (
          <View key={i} style={ui.partyCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: C.red }}>Other Driver {i + 1}</Text>
              {i > 0 && <TouchableOpacity onPress={() => setDraft(d => ({ ...d, otherParties: d.otherParties.filter((_, j) => j !== i) }))}><Text style={{ color: C.red, fontSize: 13, fontWeight: '700' }}>Remove</Text></TouchableOpacity>}
            </View>
            <Field label="Name & Surname"><Inp placeholder="Full name" value={p.name || ''} onChangeText={v => updP(i, { ...p, name: v })} /></Field>
            <Field label="Contact Number">
              <Inp
                placeholder="e.g. 0821234567"
                value={p.contact || ''}
                onChangeText={v => updP(i, { ...p, contact: digitsOnly(v).slice(0, 10) })}
                keyboardType="phone-pad"
                error={p.contact && !isValidCell(p.contact) ? 'Must be exactly 10 digits' : null}
              />
            </Field>
            <Field label="ID Number (13 digits) / Passport / Licence">
              <Inp
                placeholder="13-digit ID, Passport, or Licence number"
                value={p.idNumber || ''}
                onChangeText={v => updP(i, { ...p, idNumber: digitsOnly(v).slice(0, 13) })}
                keyboardType="phone-pad"
                error={p.idNumber && !isValidID(p.idNumber) ? (p.idNumber.length !== 13 ? 'Must be exactly 13 digits' : 'Invalid ID number — check digit incorrect') : null}
              />
            </Field>
            <Field label="Vehicle Registration"><Inp placeholder="e.g. GP 456-789" value={p.registration || ''} onChangeText={v => updP(i, { ...p, registration: v })} /></Field>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="Make" style={{ flex: 1 }}><Inp placeholder="e.g. BMW" value={p.make || ''} onChangeText={v => updP(i, { ...p, make: v })} /></Field>
              <Field label="Model" style={{ flex: 1 }}><Inp placeholder="e.g. 3 Series" value={p.model || ''} onChangeText={v => updP(i, { ...p, model: v })} /></Field>
            </View>
            <Field label="Vehicle Colour"><Inp placeholder="e.g. White" value={p.colour || ''} onChangeText={v => updP(i, { ...p, colour: v })} /></Field>
            <CheckRow label="Insurance known?" checked={p.insuranceKnown || false} onChange={v => updP(i, { ...p, insuranceKnown: v })} />
          </View>
        ))}
        <TouchableOpacity style={ui.addBtn} onPress={() => setDraft(d => ({ ...d, otherParties: [...d.otherParties, {}] }))}>
          <Text style={ui.addBtnTxt}>+ Add Another Driver / Party</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: C.border, marginVertical: 16 }} />
        <SectionHead>Witnesses</SectionHead>
        {draft.witnesses.length === 0 && <Text style={{ color: C.grey, fontSize: 13, marginBottom: 10 }}>No witnesses added yet.</Text>}
        {draft.witnesses.map((w, i) => (
          <View key={i} style={ui.partyCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: C.red }}>Witness {i + 1}</Text>
              {i > 0 && <TouchableOpacity onPress={() => setDraft(d => ({ ...d, witnesses: d.witnesses.filter((_, j) => j !== i) }))}><Text style={{ color: C.red, fontSize: 13, fontWeight: '700' }}>Remove</Text></TouchableOpacity>}
            </View>
            <Field label="Witness Name"><Inp placeholder="Full name of witness" value={w.name || ''} onChangeText={v => updW(i, { ...w, name: v })} /></Field>
            <Field label="Contact Number">
              <Inp
                placeholder="e.g. 0821234567"
                value={w.contact || ''}
                onChangeText={v => updW(i, { ...w, contact: digitsOnly(v).slice(0, 10) })}
                keyboardType="phone-pad"
                error={w.contact && !isValidCell(w.contact) ? 'Must be exactly 10 digits' : null}
              />
            </Field>
          </View>
        ))}
        <TouchableOpacity style={ui.addBtn} onPress={() => setDraft(d => ({ ...d, witnesses: [...d.witnesses, {}] }))}>
          <Text style={ui.addBtnTxt}>+ Add Another Witness</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Continue →" onPress={async () => { await saveDraft(draft); navigation.navigate('Generate', { draft }); }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 10 — GENERATE
// ─────────────────────────────────────────────────────────────────
function GenerateScreen({ navigation, route }) {
  const { draft } = route.params;
  const [busy, setBusy] = useState(false);
  const outcome = OUTCOMES[draft.accidentKey] || {};
  const items = [
    { l: 'Driver details',               ok: !!draft.driver.fullName        },
    { l: 'Vehicle details',              ok: !!draft.vehicle.registration   },
    { l: 'Accident date and location',   ok: !!(draft.accident.date && draft.accident.street) },
    { l: 'Accident type classification', ok: !!draft.accidentKey            },
    { l: 'Other parties',                ok: !!draft.otherParties?.[0]?.name},
  ];

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Generate Statement" subtitle="Review & Generate" onBack={() => navigation.goBack()} />
      <ProgressBar step={6} total={6} label="Step 6 of 6 · Generate" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <View style={{ backgroundColor: C.greenLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#81C784', padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.green, marginBottom: 12 }}>✅ Information Captured</Text>
          {items.map((it, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Text style={{ color: it.ok ? C.green : C.grey, fontWeight: '700', fontSize: 14, width: 18 }}>{it.ok ? '✓' : '○'}</Text>
              <Text style={{ color: it.ok ? C.green2 : C.grey, fontSize: 13 }}>{it.l}</Text>
            </View>
          ))}
        </View>
        {draft.accidentKey && (
          <View style={ui.card}>
            <Text style={ui.cardTitle}>Classified As</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.red, marginTop: 4, marginBottom: 4 }}>{outcome.icon} {outcome.label}</Text>
            <Text style={{ fontSize: 12, color: C.grey }}>{outcome.claimable ? '✅ May be claimable against at-fault driver' : '⚠️ Generally not claimable against a third party'}</Text>
          </View>
        )}
        <Disclaimer />
        <View style={{ backgroundColor: C.greyLight, borderRadius: 10, padding: 12 }}>
          <Text style={{ fontSize: 12, color: C.grey, textAlign: 'center', fontStyle: 'italic', lineHeight: 17 }}>Statements are generated using accident-type-specific templates. No AI is used in generation.</Text>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label={busy ? '⏳ Generating...' : '📄 Generate Draft Statement'} color={C.yellow} onPress={() => {
          setBusy(true);
          setTimeout(async () => {
            const statementText = buildStatement(draft);
            let mktConsent = false;
            try { mktConsent = (await AsyncStorage.getItem('pending_mkt_consent')) === '1'; } catch {}
            const updated = { ...draft, statementText, status: 'Complete', consentMarketing: mktConsent };
            await saveDraft(updated);
            setBusy(false);
            // Fire "completed" email — non-blocking
            sendEmail(buildEmailParams(updated, 'completed')).catch(() => {});
            navigation.navigate('Preview', { draft: updated });
          }, 800);
        }} disabled={busy} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 11 — PREVIEW
// ─────────────────────────────────────────────────────────────────
function PreviewScreen({ navigation, route }) {
  const { draft } = route.params;
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Draft Preview" subtitle="SAPS Accident Statement" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Disclaimer />
        <View style={{ backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden' }}>
          <View style={{ backgroundColor: C.red, paddingVertical: 14, paddingHorizontal: 20 }}>
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' }}>ACCIDENT STATEMENT</Text>
          </View>
          <Text style={{ padding: 20, fontSize: 13, color: C.text, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{draft.statementText}</Text>
        </View>
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Edit Statement →" onPress={() => navigation.navigate('Edit', { draft })} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 12 — EDIT
// ─────────────────────────────────────────────────────────────────
function EditScreen({ navigation, route }) {
  const [text,      setText]     = useState(route.params.draft.statementText);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Edit Statement" subtitle="Make corrections before saving" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body} keyboardShouldPersistTaps="handled">
        <Disclaimer />
        <View style={{ backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden', marginBottom: 16 }}>
          <View style={{ backgroundColor: C.red, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>EDITABLE STATEMENT</Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tap to edit</Text>
          </View>
          <TextInput style={{ padding: 18, fontSize: 13, color: C.text, lineHeight: 21, minHeight: 400, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlignVertical: 'top' }} value={text} onChangeText={setText} multiline autoCorrect={false} spellCheck={false} />
        </View>
        <CheckRow label="I confirm this statement is truthful to the best of my knowledge." checked={confirmed} onChange={setConfirmed} />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Save & Continue →" onPress={async () => {
          if (!confirmed) return Alert.alert('Confirmation Required', 'Please confirm the statement is truthful.');
          const updated = { ...route.params.draft, statementText: text, status: 'Complete' };
          await saveDraft(updated);
          navigation.navigate('Export', { draft: updated });
        }} />
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 13 — EXPORT
// ─────────────────────────────────────────────────────────────────
function ExportScreen({ navigation, route }) {
  const { draft } = route.params;
  const [busy, setBusy] = useState(false);

  const buildHtml = () => `
    <html><body style="font-family:monospace;padding:32px;font-size:13px;line-height:1.6;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;">
        <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAGOAYkDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAEHAgYDBQgE/8QARhAAAgEDAgMFBQMGDAYDAAAAAAECAwQRBQYhMUEHElFhcRMUIoGRMkLRCEVygqGxFSMkM1Jig4SSweHiQ0Rz0vDxRlST/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAEGAgQFAwf/xAAsEQEAAgIBBAIBAwQDAQEAAAAAAQIDBBEFEiExE0FRFDJhBiJCUhWBkXEj/9oADAMBAAIRAxEAPwD2WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjnyMjHrjARMT9JBi5cccPPyIjJvj3o4JOfzLPLGWY58xlf0kODx+WXyHyMcvxwTnzI4Tz/KRkhPPVDLHCP8AtORw8yMsZf8A4hxwn/tPDzHAjP8A5gklB8x8yPmMrxRB4ZAxz5k5fkEpATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwQ3hZCBvHM6vcmt2GgaTW1PUq8aNCnHLb5t9EvFk7i1vT9A0mtqWp3EaNCksty5vyS5t+SPJPanv7Ud66u5udShp1Jv3e3zwXm/GRMVlqbWzXFX+Xab27XNz6xrVStpOoVtOsYz/iqdOXFpdW/M6en2mb6h/8jvH6tYNQXBA9opDgW2Mlp55brDtU35H8/wBdrzSOaHa1vuP55m/WJogJ7YR8+T8t/XbBvtfnVP1gckO2XfcfzhRfrT/1K8A7YZfqcv5WRDtr35H/AJu0frQf4nLDtw3zF59tYy9aD/ErIDtg/VZfytOHbtvdc1pr/u7/AO454dve8V9q302X9k/xKlA7YTG3mj7XBHt+3UvtWOnv0g/xOSP5QG4l9rTLF/UpsEdkJ/WZv9l0w/KB1tPMtHtH6SaOWP5Qmqr7Wh27/tX+BSIHZCf1ub8rzj+UPffe27Rf94/2nLD8oqrHhLbUX6Xf+0ofKzx4evAc+XEdtWX6/N/s9AUvyi6b/nNry+V3/sOaP5RNn97bdRf3n/aeeFlPi4r1Z3W3Nra/uCtGnpWlVrjvPHf7rjBfrPgRNasq72zaeIXovyh9Myu9oNePk63H9x9Ft2/6VXqQp09CvJym8RjCXeb/AGHQ7Q7AbmSjW3FqXs4vi7ag849WXBtXZO3Ns08aVplCnUa+KtJd6o/1nxMJ44dDDG1f91uHFtrdl5q3cqXO37vTaE8dydzJJyz4I2mEnLpg1Pel57vXtaUMYjP2kuPFYNm0+oq1rCovvRT4nPw7dcme+OJ9OzOtfHgpe0+30AA3XiAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ1h5ASwuJ1e5tc07b2k1tS1S5jRoUo5bb5vkkvNvgRuXXNP29pNXUtUrwoUaSbbb4t+CXVnkrtR37qG9dWlUqSdGwpSfu9vnkvF/1iaxzLU2tmuKvH2y7Ud/alvTVJTnN0dNpycaFCL5Lxfi2aWAbPiIVu97ZLd1gABiAAIAAAAAAADg8gBEumOfTDwQd0f9pB3O3dr7g3BVjT0nTLm4beHNQ7sfm3zLe2h2BVZ9y43LqEKSks+7Wybfzm8YImeGxi1cuX9sKJoUqtepCjRp1Kk5vEYxj3pMsTaXY7u3Xe5Vq26063lh+0uFhtfo8MnpHauyNt7appaXpdGlPrVlFOb+ZssMd3HA8u508PTaR+5VmzOxXbOjqFfUVU1K5WMqpwpp+Uef1bLKsbK1sqSo2lvRo01wUacFFL1PqSJMZnl0seGmOOKww5NceLMZSwuPhk5T49SqxoWdarJ4UYM8727Kzafp70jm0K/wB13XvOr1nn4U1GPlwNv2Vde8aPGLeZU33WV9Wl7SpKo+cpNmy7EuvZ31W2lyqQyvVf+yh9L3pjqE3n/Kf/ABZd7Xj9FER9N5BxxbeG+qM+hfpnzCrpABKQAAAAAAAAAAAAAAAAAAAAAAIb+gDK8cZOp3Rr2n7d0itqmp140bekstt8W/BeLZG5tf03bukV9S1KvGjRox6vi30S8TyV2nb71LeurSqVqkqVhTl/J6ClwS8X5/uMqRy09vZrhrxE+U9p+/NR3rq8q1SVSjYU21Qt0+CXi/F/uNOwsJY5ch18uiB79sQrl8tss91gAEsQABAAAAAXo2+iSyOE8Afo36CKcuCXxeB3O3dra/uKqqWkabWueOHJJqMfVkemVaWtPEQ6XL5LD+TbOShSq16saVKDnUk8RiuvoXnszsCr1JQudy6j7JNZ93t+L+cn+BcW2djbZ29SUNM0yjTmudWSUpv5mPyRHpvYem5L+beHmzaPY/uzXlGrWtnpltLj7S5i4yx5JlxbO7FdraM4XGoxlqtwsPNV/An5JYz8y1FFJYQUWuvEwnJMurh0sWPzMcy+ews7SzoqjaW1KhTXKNOCil9D6HFEpcc5JPOZltxER68Ix5DGOSwSGAQI5E5EyQM1zfFy6OlOmnxqPHyNiyaHvu69pqMKCfw04Za82cfrmecOnaY9t/p2P5M8ctdXI+3R7n3XUaNZvCUsP0Z8aWCF9pZ8T53jy/Hli8Lhlxxek1+ltU5d5RaeepyHWbbuFdaTQq5y+73X8jtMH1bBkjJiraFDyV7LzEgAPZiAAAAAAAAAAAAAAAAAAAGCHzAS8DqN06/pu3dJranqdxGlRprq+Mn4JdX6Ebr3Bpu29GranqldUqNNcs8ZPkkvNs8ldp2+tS3prDrV5OlY0pYt7VPGF4vzM6V5aW3txgg7UN96nvbV3WquVGwpv+T22eEfN+LNQ/YAesV4V7JktknmQAGTAAAQB/MBLMljOf2ESefoyvFfUN45ncbc2vr24q6p6TptxcccOShiC9WW5tHsBuakoVtx6gqUHzo2yzNfrPK/YY9z3x62XJ6hR1ClVuKqpUKc6tRvChCPef0RYGz+x/duvuNatbLTraX/ABK/CWP0ef7D0ntnY+2tu0oR07TKEZx51ake9N/M2OKxhZwY2u6eHpda/ulVu0OxHbGkuFfUoy1SvHDxW400/wBHr8yzbOzt7OjGhbUKdGlFYjCnFRjH0SOePIkw7pl0seCmOOKwwcX0SOQgkxe3MgAAAAAAAIk8NB8FkPmRLqgTJJqMW34FWavcK61GvX5qc2vl0LA3Dcu10u4qJ8fZtR9StZFM/qjYm3bir/KwdEwxM2vKc5HRtLLBC45S8CoRXxx+Hf8APluPZ/dfxde1b4QlmPobbkrbad27fWKSz8M+D+hY+fxPov8AT+zObW8/SpdVwfFn/wDrMBA7rmgAAAAAAAAAAAAAAAABjxS5r1YBpLLzjxOo3ZuDTdt6PV1PUq6pU6aeIt8ZvwRG7dw6ZtnR62q6pcRpUKaylnjN9EvFnkrtL3zqW89YnXrylSs4Nqhbp/DFeL8zKKctLZ264azEe0dpm+tS3rrMq9w3Ssab/k1tn7C8X5mpDHHPUHtWOFeyZJyW5kAIb9V68mZPNII7zf3W/wBFM7jbm2dc3DWVPSNOr3Sbw5U4OUY/pNcEPHDKtJvPFYdQZ0aFWvUjToUpVKknhQim39C8No9gV3WcK+49RjQi1n2FDjL5t5Lh2tsXa+3aUY6dpNuqi51Zx78vrLLRh3RHpv4umZr+bz4ea9odke7twd2rO1Vhavj7W6fd4eUVlv54Ll2h2JbY0pQrakparcLDffj3aaf6JasYxS4LBKS6HnNuXUxaOKn15fNYWdrZ0YULO3p0aUeChCPdSPqwEiTBt1rFfQAAyAAAAAAAAAAAAAGMvtIhr4WZMhvCyQjj6arv65ULWjbx5yeWvI007fd907jWKkVLMaWI/I6g+Z9Z2Iz7drR/8XLpuL4teIAAcpvpt5ulWhUjzjJP9paen1lcWlKqmviivqVU+Bveybn2+mKm3xhL9haf6a2Ypmmk/wCTi9aw91YyfhsgCBeVZAAAAAAAAAAAAAAP0DfEhyWOaYQd7jjDOm3ZuHTtt6PW1PU68adOnF92OeM30SRG79yabtnR6up6nWVOlBfDHPGT8Eup5I7St76lvPWZXd3OVG3pv+TW+cKC8X4szrSZau1t1w1/ll2k751LeesO5uJunaU5YoUE/hjHxfn1NSSwseYTzx4vxCafVL1PescK1fLbLbumORvCHmk0vFrCO429tfXtwVo0tK0y4uO88d/uYgv1nwLd2j2A3NRRrbh1BUU1n2Nu+K9XyIm0PfHr5MnqFHUqVWtUjClTnNzeIqKy2b9tDsh3dr0o1KlqtPtp8fa1+ePJHpPauw9s7ZpRWk6XRp1lzrzip1X+u+JsvdaXA87X/DpYemRH75Vbs7sR2tpHcr6j7TVLmOH/ABvCGf0f9SzLGwtLGiqNpb0qFNLCjCKSRzwi0231Mjzm0y6VMGPHHFYR3VyGCQQ9QjBIAYAAAAAAAAAAAAAAAAAAESOC7qKla1Kj5Ri2c8uR0m8blUNIqRTw5/CjX2ssYcU3n8PTDT5MkVaBdVfa3FSo+LnJtmBCSS88Enyi090zafuZXqkdtYgIbJBgzhEuRsGx7n2eqSouXw1KfBeaOgPo0y492vaFdcO5NfTqbvT9j4NutvqGrt4/lwTWFrZ4AwpzUqcZJ5TWTLJ9TieY7vpSJhKBCJMgAAAAAAAAAMWuL4/6ATPjwOl3duPTNsaPV1LUq0adOEcxj96T6JEbu3Jpm2tFq6lqddUqcI/DFv4pvwSPMG573efalrqrWunXk7eMmqFGKxTpx8cvrjn8zOlOfLV2dj444rHMun7SN7alvPV53VzUlC0jJxt7bOFTXi/M1elSq16kKNGnUqTm8RjGPeky89n9gNefcuNyahTpqXH3a3Tk/nN4wXDtXY+2NswS0vTKNOp1qyjmb+Zna/b4cuujlzT3Xl5s2n2P7u1zu1KtutOt5YftLlYbX6PDJcmzexTbGkKFfUvaalcrGVPhTT8o8/q2WmkkuSJXIwm/Lo4dKmP2+axsbSxpKjZ29GhSXBRpwSR9OPB5HyHyMPLcjivpPAEfIfIeTmEokx+Q4knMMgYjPkQlkDHPkM+TAyBjnyY5gZAxRIRykEIkJAAAAAAAAAABEuZpW/rjvXFG3T4R+Jm6VMJZZWW4Lh3Oq16meCqOK9FwRXv6k2Pj1Zxx7s6nSMXfn5n6deiQD59/C2c8yAAAQuBIJieIRx44WHte7dzpNGUn8UF3JeqO3zwRqWwLpZr2s3170fQ26Kxk+ndKzfPp0mfalb2L4801hkiSESdNqgAAAAAAABhLL7yXdzzX+pmRKOerXoBT/aRZ3FtrEtX1zb1bXLan/M9yo3So+L7ifXhz8DrLTthpWlGNCz29bUIrpTWI/s6l21benUypwjNSWGmuZXm+uyrStXU7zS8WF3jOIx+Cb80eGWMnusujoW0pt27FP+2tS7bLtctHpL9Z/iYS7bdQXLSLX/E/xK53JtvV9v3Lo6jaygs8Ki4xa8mdPxXPPouZp2zZK+1op0vQvHNa8wtqXbbqmPh0mzX60vxOOXbZrMvs6XZL5yf+ZVPHrL6Mn9vqR+oyPT/iNSJ/YtCXbTrzXDTrNf4/xOOXbPuR/ZsbH6S/ErIehHz5PyyjperPqiypds25GuFrZx/Ul+Ji+2Pcz5UrVP8A6bK3xnmFw4LkR8+T8sv+L1f9Fiy7YN0r/wCtx8IY/eYPte3Y+PtaCX6CK9Q65Hy3n7ZR03Wj/CFgS7Wt3Pld0I/2cfwOOXaxvB/ZvqK/so/gaJnPMZ8SJy3/ACmOn60f4R/43eXapvJ/nKKfiqMMfuOOXahvV/nf6Uaf/aaWFwI+S/5Zfodf/SP/ACG4S7S95y/PEk/+jD8DjfaNvJvjrVT/APOH4GqZIHyX/KP0Ov8A6R/5D0/2Xbpe5tuU69xNO8pLuV1hJ5/pY8zbk+C4nmTsk3K9vbnpKrPFpdv2dVN9Oj+uD0xTlGpCM0+DWVg6Ovki1VM6pp/ps0zH7Z9OVPoSYwfFmR7uaAAAAAAAAAhy4ByH8k+Hxa3ce7afVq5xiLx6lX95yfeb5m8b9uvZWEKPWbz9DRsPvPHLmUH+ptjvz/HH0s/RsPbj75+0gArk+3ZAAQAAA7Hbdx7vq9vPOE13SyoSzBS8SpISdOpCa5xki0NKrK406jUXVF0/pfY7q2xT9elb63h7eMkfb7U+JJjDmzItzhgAAAAAAAAAAh5yRNNrGMmTIBL4dU0yy1O2lbX1tSr0pc4zWcehT+9uyKrSjVu9u1FJc/dpvil/VZdjaz1I7vE874q3hs629l1p/snw8d39ndWN1K2u6FShVi8ONSOOJ8/j5HqzdW09G3FbypX9rFya+GoliUWUhvbsy1jQXOvaZvbJZakl8UF5o0MmvNfK3aPWsOWIrb9zQgGu7wafe655oHg7EWi0cwAAhIAAAAAAAAAAC+F5jzXGPkejuxrc/wDDm3IW1xU715ZtU6jfOS6P6HnE2fs13DLbu6Le6nJq2m+5XWeHdfDPy5nthydluHM6ppRs4ZmPp6nhzfqZHDZ1YV6EK1N5hOKaOY6sTyoXmPEgAAAAAAAIaMZNJEvkcVaahSnJ9FxMLTxWf4Pdoho29rr2+qqlnKpRx82dDjjnPPmjn1Gq699WrN570mcB8s38/wA+xa68auP4sNagANNsAAAAABz59TdtiXanYTt5vPsnlenM0k7zZlxKlq3svu1I4Z2eibE4dmOPtz+p4fkwT/CwY82yTCnLPDyMz6Sp4AAAAAAAAAAAAAAAAYzjGXBpP1MiHgHpX++OzXR9e79e3hGyvHxU6ceEn5lIbr2hre267V9by9lnhXh8UWvX8cHq1p5OC9sra8oToXNCnWpzWJQnFNP5M8cmvXJ7dXS6xlwf2z6eOeb7uMNDj1Lu3x2RUa7nebeqexmln3eTyn6N8SndX0u/0q7dtqNrUtqkXhqax/7OfbDai26nUcGzH9s8S+MBcuKeQeTe8/YAAAAAAAATwT72MvkvUgLg8kxHBxF68S9BdhW5f4T0WWlXNRe9WeEsv7UOhZcXxx48TydsfXKu3dxW2o02+5H4Kkf6UX0PVOl3VK+sqN3QmpU6sFOD8U1lHR18vdXhRus6c4c3dHqX1IkhcyTZcgAAAMADFfZOp3VdK10evNfalHur5nb9DT9/3PClap8X8f0Ob1TYjDqzb8tnSxfJmrVqK55ZJC8fHiSfMJnmeV3AAQAAHPBzMegA57G0r3twqFGGZvnjlEyx0nJPGOPLG+SlI5swtaFa4rRpUIOU5P8AxG+bc0Snp1NVKnxVpc2cugaLS06nl/HVfOTO3WS+9J6J+mjvy+1W6h1Gc09tPRFLLMiESWKJifTlccAAJAAAAAAAAAAAAAADQAENPxDRIAxccrmdPuPbmk67bOjqVrCqsYU2vij6M7oh5y+H1ImIt7ZUvak81niXnvfPZRqekyndaPJ3tosvuY/jI/iVvUpVaVV0qtOUJrg011PZNSOVjuo07enZ9ou4oSqzpe7Xb/41NYb9cGnl1vPNVi0evTTiubz/AC8yYfHy+1joDat57F1zbdWUqtGVzaZ4VqSyseaXE1Xq0uLRpWrNZ8rRhz480d1JAFxz5Ah6zEx9AACAACZ5RwPHDPLJePYBueVewq6Fd1E6tu3Kll8e7zwUcueXxWOR2W2dVr6HrtrqdtJ9+lJOaTx3l1X0PTBfss0uo6sbWGa/cPXff4ZwZnWaFqVHVNMt763l36dWmpJrz5r5HZo60TzHL59as0tNZ9wAAlAAAMG8RzjJXG67n3nWar6QfdX+Zv2o1lQtalTkowbKvrTdSrKpJ5cnl/Mqn9T5+MUYodzouL/9JuxABSFk8/YABP5Ah5zhBs+7SNNuNQuFTpJqPOU+iPbBiyZbRGOPLG964qza8uLTbKvfVlSoRzl8X0RYOiaTb6bbJU45qPjOXizPSdNt9Ot1TowSf3n1Z9/RF96V0empT5Jjm0qnv9QnYt219Mkn4jBKB33NjwIAAAAAAAAAAAAAAAAAAAAAAAAAARLBEuXUyAHBcUKNxTdOtTjODWHGSymVhvrslsNQjO80Kas7nnKm/sT/AAf7C1iHwMbUrb298O1kwW5pLyFruh6jol57tqdpVoSTwp44M61Zxh4yeu9d0fTtatJ2moWsK9OX3ZLP08Cm979kd3aOrfbfl7zSS428n8a9Gc/LrzE8wtel12mWIrl8KoBy3dvWta8qFxRnSnB8YzjhxfocRrzEx7d2kxaO6PQADFlxIPlnPAB54Y8SZjlPHHlcfYBubFWtt66qtpv2lu2+vWP7F9S7eh460jUK+l6nb31rNwrUKnfXmj1ZtTWrfXtDttRt5fBVgm11T8Do62TmOJUrrmp8eT5a+pdyDGDyiUuJtODE8pAIYS17e1x7HSpU08SqPuo0Pol4cDY99XDlf06MH9iLbNc9T5z17P8ALuTH1C3dKxdmvEoXUkA4dZifbp+wA7TQNFq6lW70k426fxSf3z3wa9894pSOXjmz0w17rOPRdKralcKMFimn8U/DyLB06yoWNvGjQgopc3jmclha0bS3jSowUIRXBI+lH0PpfTK6lImfMqlu7t9i3jxDjbSeDLhgyB1+Ij00QAEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGCyZkYfiODlGF4B45JGWCGgems7v2Voe5KEo3lsoV8fDXp/DJP5c/mUXvXs51vb0p16UHe2cXn2tNcYr+sj01KLfXBhOjCcXGaUk1hprOTxvhrZ0tPqebVn3zH4eM+b5t+nMc+mD0Rvfst0vWYzurDu2V4llSjH4ZeWCktz7Y1jbtz7LUrVwi38FSPGMvmaWXDaq2aXVMWeO3ny6QB8Fl8PUceprw6cxMHTBavYLudWWpVNCu54pXEs0cvhGXh81n6FVHPYXNWzuad1bycalKalF9c55npS01tDU3daufBan29jQS5oyXA13YO4KW4tvW19TknNx7tRZ5TXB/ibCubOtW0WjmHzvJjnFaaSybwYyeIt55Ilvgdbr917tpVepnD7rweebJGPHNp9FKza0VhoGsXHvWqVq7eU33V6HxjPxN+eR59GfJ8+S2S/dPteKVjHWKQAjj4Gw7b0Cd5ONe6XdoLio44y/A9tXSvtXilI5NnYrgpzaXBt3RKuoTVaqnGhF/4jf7a3pW9KNOlBRjFYSQo0Y0aSp00opLC4cjmwfQ+ndMx6dPEeZVDa3L7FvPpARIOpy04gAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxw2v8j5NR02z1G2nbXtvTrUZrEoTipJ/Jn2E5ImIn2VtNZ5rKlN89j+PaXe3Jvx92m8/Rv9xUeo2V3p95O2vLapb1I8HGcccfLxPYrOi3RtbRtw2sqOoWkJya+GoliUX4pmtk14nzDvaHXMmHiuTzDyc+HP6+BKwpc+K5PxLA3r2X6zornc2He1Czi2/hWJxXmupX8k4tppprozQvjtSfK1YdrFniL0lY3YZud6TuH+C7mpi1vX3U3yjU6fXgj0NDD5ep4zp1J0qsZ05OMlJd2S5xfiepOy/ccNx7YoXLmncUl7OvHwkjd1cnPhWuv6UUvGWvqW0tZWPE1Xflz3LWFsvvvj8ja3yK63nc+8axKmn8NJHO69sfDpy5vTMPyZ4dO/3kR68MtkwXewknJ8om27Y27hxu75Zb4xh4FI0NHLtZIjF+1ZdraprU/u9uDbG3nX7t1eJumuMYPqzc6VONNJRSSXQmkoxXdikkuiM1g+iaPTcWnSIr7VHZ2r7Fu6fQiQDoNaAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJJNNNJmh737N9F3CqlxSirO+ks+3prjJ+fib6Yd1Y5YMbVi0eXriz5MNu6kvKm7Nna3tu4avLVyoJ4jXprvRkvF+B23Y5uWeg7lhQq1ErO8ap1PDPR/v8Aqejru0oXVCdC4owq058HGaymiqt7dkttcVJXm3Z+7VuaoN/A35eBp2wTSe+qxYOr4drHOLZj2tSvUjC2nVbWFFyKwuZVLm7qSWZSlNuKXmdroGq6rX2m9M1G3qUtUtsW1WnNcZrkpLxTXHJ3+2tBhZwVxcx79b7uehx+r62Tfz1wf4/bS1L10cd8lp5/Dh2zt9UMXV3BOq+MYv7ptUUksDHDkEdvU1MWnTspDl59i2e3dYikjIiKJNqOPp4gAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEn1ZIAhpvqYzg5dfUzA5HA7Wk5qo4xc1yk1xRydx+PEzBERETyTzM8yjAwSCQSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z" style="width:60px;height:60px;object-fit:contain;" />
        <div>
          <h2 style="font-family:sans-serif;color:#C62828;margin:0 0 2px;">SAPS Accident Statement</h2>
          <p style="font-family:sans-serif;color:#888;margin:0;font-size:11px;letter-spacing:1px;">A FREE SERVICE BY MYLAWSA</p>
        </div>
      </div>
      <hr style="border:none;border-top:2px solid #C62828;margin-bottom:24px;"/>
      <pre style="white-space:pre-wrap;font-family:monospace;font-size:13px;line-height:1.7;">${draft.statementText}</pre>
      <hr style="border:none;border-top:1px solid #ddd;margin-top:48px;margin-bottom:12px;"/>
      <p style="font-family:sans-serif;font-size:9px;color:#aaa;line-height:1.6;font-style:italic;text-align:center;">
        This statement was generated using the SAPS AccidentStatement tool, a free service provided by MyLawSA. The accuracy, completeness, and truthfulness of the contents of this statement are the sole responsibility of the person who provided the information. MyLawSA, its directors, employees, and agents accept no liability whatsoever for any inaccurate, false, or misleading information contained herein. This document does not constitute legal advice.
      </p>
    </body></html>`;

  const handleShare = async () => {
    try {
      setBusy(true);
      const { uri } = await Print.printToFileAsync({ html: buildHtml() });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share your accident statement' });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setBusy(false);
    }
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({ html: buildHtml() });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const ExCard = ({ icon, title, sub, accent, onPress }) => (
    <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, borderWidth: 1.5, padding: 18, marginBottom: 12 }, accent ? { backgroundColor: C.red, borderColor: C.red } : { backgroundColor: 'white', borderColor: C.border }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: accent ? 'white' : C.text, marginBottom: 3 }}>{title}</Text>
        <Text style={{ fontSize: 13, color: accent ? 'rgba(255,255,255,0.65)' : C.grey }}>{sub}</Text>
      </View>
      <Text style={{ color: accent ? 'rgba(255,255,255,0.5)' : C.grey, fontSize: 22 }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="Export Options" subtitle="Share or save your statement" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <Text style={{ fontSize: 15, color: C.grey, lineHeight: 22, marginBottom: 20 }}>Your statement is ready. Generate a branded PDF with your company logo and share or print it.</Text>
        <ExCard icon="📤" title="Share PDF" sub="Send via WhatsApp, Email, or any app" accent onPress={handleShare} />
        <ExCard icon="🖨️" title="Print Statement" sub="Open the print dialog on your device" onPress={handlePrint} />
        <Disclaimer />
        {draft.statementTypeId === 'vehicle_accident' && (
          <View style={{ backgroundColor: C.redLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#FFCDD2', padding: 20 }}>
            <Text style={{ fontSize: 26, marginBottom: 8 }}>💼</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.red, marginBottom: 8, lineHeight: 22 }}>Can we help recover your damages?</Text>
            <Text style={{ fontSize: 13, color: C.grey, lineHeight: 19, marginBottom: 8 }}>MyLawSA specialises in recovering vehicle accident damage (NOMS) from the at-fault driver — at no upfront cost to you.</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: C.red }}>No Win. No Fee.</Text>
          </View>
        )}
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        {draft.statementTypeId === 'vehicle_accident'
          ? <Btn label={busy ? '⏳ Generating...' : 'Continue →'} onPress={() => navigation.navigate('Assistance', { draft })} disabled={busy} />
          : <Btn label={busy ? '⏳ Generating...' : 'Done ✓'} onPress={() => navigation.navigate('Home')} disabled={busy} />
        }
      </BottomBar>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 14 — MYLAWSA + SCREEN 15 SUCCESS MODAL
// ─────────────────────────────────────────────────────────────────
function AssistanceScreen({ navigation, route }) {
  const { draft } = route.params;
  const [consent, setConsent] = useState(draft.consentMyLawSA || false);
  const [done,    setDone]    = useState(false);
  return (
    <SafeAreaView style={ui.safe} edges={['bottom']}>
      <TopBar title="MyLawSA Assistance" subtitle="Optional" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ui.body}>
        <View style={{ backgroundColor: C.red, borderRadius: 18, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 38, marginBottom: 14 }}>🏛️</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.4, marginBottom: 10 }}>Recover Your Vehicle Damage</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 21, marginBottom: 16 }}>My Law SA is a registered debt collector that recovers uninsured motor accident damage (NOMS) on your behalf — from the party at fault.</Text>
          <View style={{ backgroundColor: C.yellow, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>No upfront cost to you.</Text>
          </View>
        </View>
        <View style={{ backgroundColor: C.greenLight, borderRadius: 14, borderWidth: 1.5, borderColor: '#81C784', padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: C.green, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>✅ How it works</Text>
          {['We send a formal demand to the at-fault driver.', 'The defendant pays our 10% handling commission.', 'You receive your damage recovery minus our success fee.', 'Zero risk to you.'].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: C.green2, lineHeight: 19 }}>{t}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 }}>Would you like MyLawSA to contact you?</Text>
        <CheckRow label="Yes, MyLawSA may contact me regarding assistance with recovering my vehicle damage." sublabel="We will use your details submitted during this session" checked={consent} onChange={setConsent} />
      </ScrollView>
      <BottomBar>
        <BtnGhost label="← Back" onPress={() => navigation.goBack()} />
        <Btn label="Finish ✓" onPress={async () => {
                const finalDraft = { ...draft, consentMyLawSA: consent, status: 'Complete' };
                await saveDraft(finalDraft);
                // Fire emails based on consents — non-blocking
                if (consent) sendEmail(buildEmailParams(finalDraft, 'noms_optin')).catch(() => {});
                if (finalDraft.consentMarketing) sendEmail(buildEmailParams(finalDraft, 'marketing_optin')).catch(() => {});
                setDone(true);
              }} />
      </BottomBar>

      {/* Screen 15 — Success */}
      <Modal visible={done} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', maxWidth: 380, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 38 }}>✅</Text>
            </View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginBottom: 12 }}>Done!</Text>
            <Text style={{ fontSize: 15, color: C.text, textAlign: 'center', lineHeight: 22, marginBottom: 8 }}>Your report has been completed. Your SAPS accident statement is ready.</Text>
            <Text style={{ fontSize: 13, color: C.grey, textAlign: 'center', lineHeight: 19, marginBottom: 28 }}>If you consented, a MyLawSA consultant will be in touch shortly.</Text>
            <TouchableOpacity style={{ backgroundColor: C.red, borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center' }} onPress={() => { setDone(false); navigation.navigate('Home'); }} activeOpacity={0.85}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SHARED STYLESHEET
// ─────────────────────────────────────────────────────────────────
const ui = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  body:        { padding: 24, paddingBottom: 16 },
  heading:     { fontSize: 28, fontWeight: '800', color: C.red, letterSpacing: -0.5, marginBottom: 10 },
  secLbl:      { fontSize: 11, fontWeight: '700', color: C.grey, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },

  topBar:      { backgroundColor: C.red, paddingTop: 52, paddingBottom: 14, paddingHorizontal: 20 },
  topBarRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:     { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  backBtnTxt:  { color: 'white', fontSize: 26, lineHeight: 30, marginTop: -2 },
  logoBox:     { width: 36, height: 36, backgroundColor: C.yellow, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoTxt:     { color: 'white', fontSize: 18 },
  barTitle:    { color: 'white', fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  barSub:      { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 1 },

  progressWrap:  { backgroundColor: C.red, paddingHorizontal: 20, paddingBottom: 14 },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.yellow, borderRadius: 2 },
  progressLbl:   { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  fieldLbl:    { fontSize: 11, fontWeight: '700', color: C.grey, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  inp:         { backgroundColor: C.greyLight, borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },

  checkRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, backgroundColor: C.greyLight, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, marginBottom: 10 },
  checkBox:    { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkLbl:    { fontSize: 14, color: C.text, lineHeight: 20, flex: 1 },

  btn:         { flex: 1, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnTxt:      { color: 'white', fontSize: 15, fontWeight: '700' },
  bottomBar:   { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 28, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border },

  infoBox:     { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: C.greyLight, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: C.yellow, padding: 14, marginBottom: 16 },
  disclaimer:  { backgroundColor: C.yellowLight, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: C.yellow, padding: 14, marginBottom: 16 },
  disclaimerTitle: { fontSize: 11, fontWeight: '700', color: C.yellow2, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  disclaimerTxt:   { fontSize: 12, color: C.yellow2, lineHeight: 18 },

  banner:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 12, borderWidth: 1.5, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  bannerSub:   { fontSize: 12, lineHeight: 17 },

  tabs:        { flexDirection: 'row', backgroundColor: C.greyLight, borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn:      { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  sheetHandle:  { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle:   { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 },
  sheetItem:    { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },

  card:        { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 14 },
  cardTitle:   { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 },

  subCard:     { backgroundColor: 'white', borderRadius: 12, borderWidth: 1.5, borderColor: C.border, padding: 14, marginBottom: 10 },
  subTxt:      { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 8, lineHeight: 20 },

  newBtn:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.red, borderRadius: 14, padding: 18, marginBottom: 24, shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  draftCard:   { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt:   { fontSize: 12, fontWeight: '700' },

  partyCard:   { backgroundColor: 'white', borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 16, marginBottom: 12 },
  addBtn:      { borderWidth: 1.5, borderColor: C.red, borderStyle: 'dashed', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  addBtnTxt:   { color: C.red, fontSize: 14, fontWeight: '700' },
});

// ─────────────────────────────────────────────────────────────────
// NAVIGATION + ROOT
// ─────────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={C.red} />
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} initialRouteName="Home">
          {/* ── NEW: Category & Type selection ── */}
          <Stack.Screen name="Home"           component={HomeScreen}           />
          <Stack.Screen name="TypePicker"     component={TypePickerScreen}     />
          <Stack.Screen name="StatementSplash"component={StatementSplashScreen}/>
          {/* ── Generic non-vehicle flow ── */}
          <Stack.Screen name="GenericConsent" component={GenericConsentScreen} />
          <Stack.Screen name="GenericForm"    component={GenericFormScreen}    />
          <Stack.Screen name="GenericPreview" component={GenericPreviewScreen} />
          {/* ── Existing vehicle accident flow ── */}
          <Stack.Screen name="Splash"         component={SplashScreen}         />
          <Stack.Screen name="Welcome"        component={WelcomeScreen}        />
          <Stack.Screen name="Reports"        component={ReportsScreen}        />
          <Stack.Screen name="Details"        component={DetailsScreen}        />
          <Stack.Screen name="Classifier"     component={ClassifierScreen}     />
          <Stack.Screen name="Outcome"        component={OutcomeScreen}        />
          <Stack.Screen name="OtherParties"   component={OtherPartiesScreen}   />
          <Stack.Screen name="Generate"       component={GenerateScreen}       />
          <Stack.Screen name="Preview"        component={PreviewScreen}        />
          <Stack.Screen name="Edit"           component={EditScreen}           />
          <Stack.Screen name="Export"         component={ExportScreen}         />
          <Stack.Screen name="Assistance"     component={AssistanceScreen}     />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
