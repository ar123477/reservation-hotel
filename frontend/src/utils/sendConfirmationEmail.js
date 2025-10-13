import emailjs from '@emailjs/browser';

export const sendConfirmationEmail = async (reservation) => {
  const client = reservation.informations_client || reservation.client || {};
  const hotel = reservation.hotel || {};
  const montantTotal = reservation.montant_total ?? reservation.montantTotal;

  const templateParams = {
    to_name: `${client.prenom || ''} ${client.nom || ''}`.trim(),
    to_email: client.email,
    reservation_number: reservation.numero_reservation,
    payment_status: reservation.statut_paiement === 'paye_online' ? 'Payé en ligne' : 'À régler sur place',
    hotel_name: hotel.nom,
    montant_total: (Number(montantTotal || 0)).toLocaleString('fr-FR') + ' FCFA'
  };

  try {
    await emailjs.send(
      'service_i01xkhm',     // ← remplace par ton vrai Service ID
      'template_lcyxoyr',    // ← remplace par ton vrai Template ID
      templateParams,
      'DoNII59lRb1p4VF3x'       // ← colle ici ta Public Key
    );
    console.log('✅ Email de confirmation envoyé à', reservation.client.email);
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’email :', error);
  }
};
