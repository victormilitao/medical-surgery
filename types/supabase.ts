export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            alerts: {
                Row: {
                    created_at: string
                    id: string
                    is_resolved: boolean | null
                    message: string | null
                    patient_id: string | null
                    severity: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_resolved?: boolean | null
                    message?: string | null
                    patient_id?: string | null
                    severity?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_resolved?: boolean | null
                    message?: string | null
                    patient_id?: string | null
                    severity?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "alerts_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            daily_reports: {
                Row: {
                    answers: Json | null
                    created_at: string
                    date: string | null
                    id: string
                    pain_level: number | null
                    patient_id: string | null
                    symptoms: Json | null
                }
                Insert: {
                    answers?: Json | null
                    created_at?: string
                    date?: string | null
                    id?: string
                    pain_level?: number | null
                    patient_id?: string | null
                    symptoms?: Json | null
                }
                Update: {
                    answers?: Json | null
                    created_at?: string
                    date?: string | null
                    id?: string
                    pain_level?: number | null
                    patient_id?: string | null
                    symptoms?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_reports_patient_id_fkey"
                        columns: ["patient_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            patients: {
                Row: {
                    created_at: string
                    doctor_id: string | null
                    id: string
                    status: string | null
                    surgery_date: string | null
                    surgery_type: string | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    doctor_id?: string | null
                    id: string
                    status?: string | null
                    surgery_date?: string | null
                    surgery_type?: string | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    doctor_id?: string | null
                    id?: string
                    status?: string | null
                    surgery_date?: string | null
                    surgery_type?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "patients_doctor_id_fkey"
                        columns: ["doctor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "patients_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    created_at: string
                    cpf: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    role: string | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    cpf?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    role?: string | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    cpf?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    role?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
