'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // User info from token (readonly mostly)
    const [user, setUser] = useState<any>(null);

    // Patient Profile Form Data
    const [formData, setFormData] = useState({
        id: null,
        nom: '',
        prenom: '',
        email: '',
        gender: 'MALE', // Default
        emergencyContact: '',
        dateNaissance: '', // YYYY-MM-DD
        phone: '',
        secondaryPhone: '',
        addressRue: '',
        addressVille: '',
        addressCodePostal: '',
        addressPays: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem('medinsight_user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            const userData = JSON.parse(userStr);
            setUser(userData);

            const patient = await patientService.getPatientByUserId(userData.id);
            if (patient) {
                setFormData({
                    id: patient.id,
                    nom: patient.nom || '',
                    prenom: patient.prenom || '',
                    email: patient.email || '',
                    gender: patient.gender || 'MALE',
                    emergencyContact: patient.emergencyContact || '',
                    dateNaissance: patient.profile?.dateNaissance || '',
                    phone: patient.profile?.telephone || '',
                    secondaryPhone: patient.profile?.telephoneSecondaire || '',
                    addressRue: patient.profile?.adresse?.rue || '',
                    addressVille: patient.profile?.adresse?.ville || '',
                    addressCodePostal: patient.profile?.adresse?.codePostal || '',
                    addressPays: patient.profile?.adresse?.pays || ''
                });
            }

        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Construct the payload matching backend structure
            const payload = {
                id: formData.id,
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                gender: formData.gender,
                emergencyContact: formData.emergencyContact,
                profile: {
                    dateNaissance: formData.dateNaissance,
                    telephone: formData.phone,
                    telephoneSecondaire: formData.secondaryPhone,
                    adresse: {
                        rue: formData.addressRue,
                        ville: formData.addressVille,
                        codePostal: formData.addressCodePostal,
                        pays: formData.addressPays
                    }
                }
            };

            if (formData.id) {
                await patientService.updatePatient(formData.id, payload);
                toast.success("Profile updated successfully");
            } else {
                // Should ideally not happen if patient is created on registration, 
                // but if we support creating profile here:
                toast.error("Profile Record missing. Contact Admin.");
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                <div className="flex flex-col gap-9 max-w-4xl mx-auto">

                    <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white text-xl">
                                My Profile Settings
                            </h3>
                            <p className="text-sm text-body-color mt-1">Manage your personal information</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6.5">

                            {/* Personal Info */}
                            <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">Personal Information</h4>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">First Name</label>
                                    <input
                                        type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                                        placeholder="First Name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Last Name</label>
                                    <input
                                        type="text" name="nom" value={formData.nom} onChange={handleChange}
                                        placeholder="Last Name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Email Address</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Date of Birth</label>
                                    <input
                                        type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Gender</label>
                                    <select
                                        name="gender" value={formData.gender} onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    >
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Emergency Contact</label>
                                    <input
                                        type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
                                        placeholder="Contact Name & Phone"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <hr className="my-6 border-stroke dark:border-strokedark" />

                            {/* Contact & Address */}
                            <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">Contact & Address</h4>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Phone</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">Secondary Phone (Optional)</label>
                                    <input
                                        type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange}
                                        placeholder="Secondary Phone"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Street Address</label>
                                <input
                                    type="text" name="addressRue" value={formData.addressRue} onChange={handleChange}
                                    placeholder="Street Address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/3">
                                    <label className="mb-2.5 block text-black dark:text-white">City</label>
                                    <input
                                        type="text" name="addressVille" value={formData.addressVille} onChange={handleChange}
                                        placeholder="City"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full xl:w-1/3">
                                    <label className="mb-2.5 block text-black dark:text-white">Zip Code</label>
                                    <input
                                        type="text" name="addressCodePostal" value={formData.addressCodePostal} onChange={handleChange}
                                        placeholder="Zip Code"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full xl:w-1/3">
                                    <label className="mb-2.5 block text-black dark:text-white">Country</label>
                                    <input
                                        type="text" name="addressPays" value={formData.addressPays} onChange={handleChange}
                                        placeholder="Country"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4.5">
                                <button type="button" onClick={() => router.back()} className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                                    Cancel
                                </button>
                                <button disabled={saving} type="submit" className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
